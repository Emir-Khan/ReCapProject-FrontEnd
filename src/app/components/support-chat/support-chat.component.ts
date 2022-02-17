import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';
import { generate, Observable, Subscription } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-support-chat',
  templateUrl: './support-chat.component.html',
  styleUrls: ['./support-chat.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SupportChatComponent implements OnInit, OnDestroy {
  messages: string = ``;
  message: string;
  usersText:string;
  rooms:string[] =[]
  chatId:string

  constructor(private messageService: MessageService, private socket: Socket,cookieService:CookieService) {
    this.chatId = cookieService.get("chatId")
   }

  ngOnInit() {
    this.connect();
    this.messageService.join(this.chatId)

    this.socket.on("rooms",(rooms:any)=>{
      this.rooms=rooms
    })

    this.generateSupportMessage()
    this.generateUserMessage()
  }

  ngOnDestroy() {
    this.messageService.disconnect();
  }

  connect() {
    this.messageService.connect();
  }
 
  sendMessage() {
    console.log(this.chatId)
    this.messageService.sendSupportMessage(this.message,this.chatId)
  }

  joinToUserRoom(room:string){
    this.chatId = room
    this.messageService.join(this.chatId)
  }

  generateUserMessage(){
    this.socket.on("user msg",(message:any)=>{
      if (message != undefined) {
        this.createUserMessageElements(message)
      }
    })
  }

  generateSupportMessage(){
    this.socket.on("sup msg", (message: any) => {
      console.log("message here")
      if (message != undefined) {
        this.createSupportMessageElements(message)
      }
    })
  }

  private createUserMessageElements(message: string) {
    this.messages+= `<div class="chat-message-left pb-4">
    <div><img src="https://bootdey.com/img/Content/avatar/avatar3.png" alt="Sharon Lessman" width="40" height="40"
            class="rounded-circle mr-1">
        <div class="text-muted small text-nowrap mt-2">2:36 am</div>
    </div>
    <div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
        <div class="font-weight-bold mb-1">Sharon Lessman</div> `+message+`
    </div>
    </div>`
  }

  private createSupportMessageElements(message: string) {
    this.messages+= `<div class="chat-message-right mb-4">
    <div><img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="Chris Wood" width="40" height="40"
            class="rounded-circle mr-1">
        <div class="text-muted small text-nowrap mt-2">2:41 am</div>
    </div>
    <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
        <div class="font-weight-bold mb-1">USERNAME</div> `+message+`
    </div>
  </div>`
  }

  someoneConnected(){
    this.usersText+=`<a href="#" class="list-group-item list-group-item-action border-0">
    <div class="badge bg-success float-right">5</div>
    <div class="d-flex align-items-start"><img src="https://bootdey.com/img/Content/avatar/avatar5.png"
        alt="Vanessa Tucker" width="40" height="40" class="rounded-circle mr-1">
      <div class="flex-grow-1 ml-3"> Vanessa Tucker <div class="small"><span aria-hidden="true"
            class="fas fa-circle chat-online"></span> Online</div>
      </div>
    </div>
    </a>`
    // başka bir fonksiyon
    /* this.socket.on("connect",(data:Message)=>{
      // emit it
    }) */
  }
  

}