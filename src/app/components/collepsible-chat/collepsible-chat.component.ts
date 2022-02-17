import { AfterContentInit, Component, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { Guid } from 'guid-typescript';
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-collepsible-chat',
  templateUrl: './collepsible-chat.component.html',
  styleUrls: ['./collepsible-chat.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CollepsibleChatComponent implements OnInit, AfterContentInit {
  messages: string = ``;
  message: string
  chatId:string

  constructor(private renderer: Renderer2, private socket: Socket, private messageService: MessageService,cookieService: CookieService) {
    if (cookieService.get("chatId") == "" || cookieService.get("guestId") == null) {
      cookieService.set("chatId", Guid.create().toString(),{expires:100})
    }
    this.chatId = cookieService.get("chatId")
  }

  ngOnInit(): void {
    this.messageService.connect()
    this.messageService.join(this.chatId)
    this.socket.on("sup msg", (message: any) => {
      console.log("messg")
      if (message != undefined) {
        this.generateUserMessage(message)
      }
    })
    this.socket.on("user msg", (message: any) => {
      if (message != undefined) {
        this.generateSelfMessage(message)
      }
    })  
  }

  ngAfterContentInit(): void {
    this.load()
  }

  load() {
    console.log("working")
    const script = this.renderer.createElement('script');
    script.src = 'assets/dist/js/collepsibleChat.js';
    script.onload = () => {
      console.log('script loaded');
    }
    this.renderer.appendChild(document.querySelector("body"), script);
  }

  generateSelfMessage(message: string) {
    this.messages += `
    <div id="cm-msg-1" class="chat-msg self" style=""> <span class="msg-avatar"><img src="https://bootdey.com/img/Content/avatar/avatar3.png"></span>
    <div class="cm-msg-text">`+ message + `</div>
    </div>
    `
  }

  generateUserMessage(message: string) {
    this.messages += `<div id="cm-msg-2" class="chat-msg user" style=""> <span class="msg-avatar"> 
    <img src="https://bootdey.com/img/Content/avatar/avatar3.png"> </span>
    <div class="cm-msg-text">`+ message + `</div>
  </div>`
  }

  sendMessage() {
    this.messageService.sendMessage(this.message,this.chatId)
  }
}
