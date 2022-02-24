import { AfterContentInit, Component, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { Guid } from 'guid-typescript';
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';
import { Message } from 'src/app/models/message';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-collepsible-chat',
  templateUrl: './collepsible-chat.component.html',
  styleUrls: ['./collepsible-chat.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CollepsibleChatComponent implements OnInit, OnDestroy, AfterContentInit {
  messages: Message[] = [];
  message: string
  chatId: string
  hasInfo:boolean =false
  userEmail:string
  userName:string
  userData:string

  constructor(private renderer: Renderer2, private socket: Socket, private messageService: MessageService,private cookieService: CookieService) {
    if (cookieService.get("chatId") == "" || cookieService.get("guestId") == null) {
      cookieService.set("chatId", Guid.create().toString(), { expires: 100 })
      this.chatId= cookieService.get("chatId")
    }

    if (cookieService.get("userData")!=null&&cookieService.get("userData")!="") {
      this.hasInfo = true
      this.userData = cookieService.get("userData")
      this.chatId= cookieService.get("chatId")
    }
  }

  ngOnInit(): void {
    if (this.hasInfo==true) {
      this.messageService.connect()
      this.messageService.joinTwoParam(this.chatId,this.userData)
      this.messageService.joinToRoom(this.chatId)
      this.getOldMessages()
      this.generateSelfMessage()
      this.generateSupportMessage()
    }
  }

  ngAfterContentInit(): void {
    this.load()
  }

  ngOnDestroy(): void {
    this.messageService.disconnect()
  }

  sendMessage() {
    if (this.message != "" && this.message != null) {
      this.messageService.sendMessage(this.message, this.chatId,this.userData)
    }
  }

  sendUserData(){
    if ((this.userEmail != null && this.userEmail != "")&&(this.userName != null && this.userName != "")) {

      this.cookieService.set("userData",JSON.stringify({name:this.userName,email:this.userEmail}))
      this.userData = this.cookieService.get("userData")
      this.hasInfo = true

      this.messageService.connect()
      this.messageService.joinTwoParam(this.chatId,this.userData)
      this.messageService.joinToRoom(this.chatId)
      this.getOldMessages()
      this.generateSelfMessage()
      this.generateSupportMessage()
    }
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

  getOldMessages() {
    this.socket.on("get message", (messages: any) => {
      console.log(messages)
      let keys = Object.keys(messages)
      for (let i = 1, index = 0; i < Object.keys(messages).length + 1; i++, index++) {
        if (messages[keys[index]].sender == "support") {
          this.createSupportMessage(messages[keys[index]].message)
        } else {
          this.createSelfMessage(messages[keys[index]].message)
        }
      }

    })
  }

  generateSelfMessage() {
    this.socket.on("user msg", (message: any) => {
      if (message != undefined) {
        this.createSelfMessage(message)
      }
    })
  }

  generateSupportMessage() {
    this.socket.on("sup msg", (message: any) => {
      if (message != undefined) {
        this.createSupportMessage(message)
      }
    })
  }

  private createSelfMessage(message: string) {
    this.messages.push({
      message: `
     <span class="msg-avatar"><img src="https://bootdey.com/img/Content/avatar/avatar3.png"></span>
    <div class="cm-msg-text">`+ message + `</div>
    `, date: new Date(), class: "chat-msg self"
    })
  }

  private createSupportMessage(message: string) {
    this.messages.push({
      message: ` <span class="msg-avatar"> 
    <img src="https://bootdey.com/img/Content/avatar/avatar3.png"> </span>
    <div class="cm-msg-text">`+ message + `</div>`,
      date: new Date(), class: "chat-msg user"
    })
  }
}
