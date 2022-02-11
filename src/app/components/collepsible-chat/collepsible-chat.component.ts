import { AfterContentInit, Component, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-collepsible-chat',
  templateUrl: './collepsible-chat.component.html',
  styleUrls: ['./collepsible-chat.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CollepsibleChatComponent implements OnInit,AfterContentInit {
  messages:string=``;
  message:string  

  constructor(private renderer: Renderer2, private socket: Socket,private messageService: MessageService) { }

  ngOnInit(): void {
    this.socket.on("chat message", (message: any) => {
      if (message != undefined) {
        this.generateSelfMessage(message);
      }
      if (message != undefined) {
        this.generateUserMessage(message)
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

  generateSelfMessage(message: string){
    this.messages+=`
    <div id="cm-msg-1" class="chat-msg self" style=""> <span class="msg-avatar"><img src="https://bootdey.com/img/Content/avatar/avatar3.png"></span>
    <div class="cm-msg-text">`+message+`</div>
    </div>
    `
  }

  generateUserMessage(message: string){
    this.messages+=`<div id="cm-msg-2" class="chat-msg user" style=""> <span class="msg-avatar"> 
    <img src="https://bootdey.com/img/Content/avatar/avatar3.png"> </span>
    <div class="cm-msg-text">`+message+`</div>
  </div>`
  }

  sendMessage() {
    this.messageService.sendMessage(this.message)
  }
}
