import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';
import { generate, Observable, Subscription } from 'rxjs';
import { Message } from 'src/app/models/message';
import { Room } from 'src/app/models/room';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-support-chat',
  templateUrl: './support-chat.component.html',
  styleUrls: ['./support-chat.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SupportChatComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  message: string;
  usersText: string;
  onRooms: Room[] = []
  offRooms: Room[] = []
  chatId: string
  cookieId: string
  sortDate:Date

  constructor(private messageService: MessageService, private socket: Socket, cookieService: CookieService) {
    this.chatId = cookieService.get("chatId")
    this.cookieId = cookieService.get("chatId")
  }

  ngOnInit() {
    this.connect();
    this.messageService.join(this.cookieId)
    this.getOnlineRooms()
    this.getOfflineRooms()
    this.generateSupportMessage()
    this.generateUserMessage()
    this.getOldMessages()
  }

  ngOnDestroy() {
    this.messageService.disconnect();
  }

  connect() {
    this.messageService.connect();
  }

  getOnlineRooms() {
    this.socket.on("online rooms", (roomsData: string[]) => {
      let data = [];
      for (let i = 0; i < roomsData.length; i++) {
        data[i] = { roomName: roomsData[i], status: true }
      }
      this.onRooms = data
    })
  }

  getOfflineRooms() {
    this.socket.on("offline rooms", (roomsData: string[]) => {
      let data = [];
      for (let i = 0; i < roomsData.length; i++) {
        data[i] = { roomName: roomsData[i], status: false }
      }
      this.offRooms = data
    })
  }

  sendMessage() {
    console.log(this.chatId)
    this.messageService.sendSupportMessage(this.message, this.chatId)
  }

  joinToUserRoom(room: string) {
    this.chatId = room
    this.messageService.joinToRoom(this.chatId)
  }

  getOldMessages(){
    this.socket.on("get message", (messages: any) => {
      this.messages = [];
      console.log(messages)
      let keys = Object.keys(messages)
      for (let i = 1, index = 0; i < Object.keys(messages).length + 1; i++, index++) {
        if (messages[keys[index]].sender == "support") {
          this.createSupportMessageElements(messages[keys[index]].message,parseInt(keys[index]))
        } else {
          this.createUserMessageElements(messages[keys[index]].message,parseInt(keys[index]))
        }
      }

    })
  }

  generateUserMessage() {
    this.socket.on("user msg", (message: Message) => {
      if (message != undefined) {
        this.createUserMessageElements(message.toString(),Date.now())
      }
    })
  }

  generateSupportMessage() {
    this.socket.on("sup msg", (message: Message) => {
      console.log("message here")
      if (message != undefined) {
        this.createSupportMessageElements(message.toString(),Date.now())
      }
    })
  }

  private createUserMessageElements(message: string,date:number) {
    this.messages.push({message:`<div class="chat-message-left pb-4">
    <div><img src="https://bootdey.com/img/Content/avatar/avatar3.png" alt="Sharon Lessman" width="40" height="40"
            class="rounded-circle mr-1">
        <div class="text-muted small text-nowrap mt-2">`+new DatePipe("en-us").transform(date,"shortTime")+`</div>
    </div>
    <div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
        <div class="font-weight-bold mb-1">Sharon Lessman</div> `+ message + `
    </div>
    </div>`,"date":new Date(date),class:"chat-message-left mb-4"})
  }

  private createSupportMessageElements(message: string,date:number) {
    this.messages.push({message:`
    <div><img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="Chris Wood" width="40" height="40"
            class="rounded-circle mr-1">
        <div class="text-muted small text-nowrap mt-2">`+new DatePipe("en-us").transform(date,"shortTime")+`</div>
    </div>
    <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
        <div class="font-weight-bold mb-1">USERNAME</div> `+message+ `
    </div>
 `,"date":new Date(date),"class":"chat-message-right mb-4"})
  }
}