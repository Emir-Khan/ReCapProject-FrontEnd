import { DatePipe } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
export class SupportChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  messages: Message[] = [];
  message: string;
  usersText: string;
  onRooms: Room[] = []
  offRooms: Room[] = []
  chatId: string
  cookieId: string
  sortDate: Date
  selectedUser: string
  userData:string

  constructor(private messageService: MessageService, private socket: Socket, cookieService: CookieService) {
    this.chatId = cookieService.get("chatId")
    this.cookieId = cookieService.get("chatId")
    if (cookieService.get("userData")!=null&&cookieService.get("userData")!="") {
      this.userData = cookieService.get("userData")
    }
  }

  ngOnInit() {
    this.connect();
    this.messageService.joinTwoParam(this.cookieId,this.userData)
    this.getOnlineRooms()
    this.getOfflineRooms()
    this.generateSupportMessage()
    this.generateUserMessage()
    this.getOldMessages()
  }

  ngOnDestroy() {
    this.messageService.disconnect();
  }

  ngAfterViewChecked(): void {
    this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  }

  connect() {
    this.messageService.connect();
  }

  getOnlineRooms() {
    this.socket.on("online rooms", (roomsData: string[]) => {
      // kullanıcı ismi ile birlikte göster + refactor
      let data = [];
      for (let i = 0; i < roomsData.length; i++) {
        console.log(JSON.parse(roomsData[i]))
        let roomData = JSON.parse(roomsData[i])
        data[i] = { roomName: roomData.roomName,name:roomData.name,email:roomData.email, status: true }
      }
      console.log(data)
      this.onRooms = data
    })
  }

  getOfflineRooms() {
    this.socket.on("offline rooms", (roomsData: string[]) => {
      
      let data = [];
      for (let i = 0; i < roomsData.length; i++) {
        console.log(JSON.parse(roomsData[i]))
        let roomData = JSON.parse(roomsData[i])
        data[i] = { roomName: roomData.roomName,name:roomData.name,email:roomData.email, status: false }
      }
      this.offRooms = data
    })
  }

  sendMessage() {
    console.log(this.chatId)
    if (this.message != "" && this.message != null) {
      this.messageService.sendSupportMessage(this.message, this.chatId,this.userData)
    }
    this.message = ""
  }

  joinToUserRoom(room: string) {
    this.selectedUser = room
    this.chatId = room
    this.messageService.joinToRoom(this.chatId)
  }

  getOldMessages() {
    this.socket.on("get message", (messages: any) => {
      console.log(messages)
      this.messages =[]
      let keys = Object.keys(messages)
      for (let i = 1, index = 0; i < Object.keys(messages).length + 1; i++, index++) {
        if (messages[keys[index]].sender == "support") {
          this.createSupportMessageElements(messages[keys[index]].message, parseInt(keys[index]),messages[keys[index]].name)
        } else {
          this.createUserMessageElements(messages[keys[index]].message, parseInt(keys[index]),messages[keys[index]].name)
        }
      }

    })
  }

  generateUserMessage() {
    this.socket.on("user msg", (message: Message,userName:any) => {
      if (message != undefined) {
        this.createUserMessageElements(message.toString(), Date.now(),userName)
      }
    })
  }

  generateSupportMessage() {
    this.socket.on("sup msg", (message: Message,userName:any) => {
      console.log(userName)
      if (message != undefined) {
        this.createSupportMessageElements(message.toString(), Date.now(),userName)
      }
    })
  }

  private createUserMessageElements(message: string, date: number,userName:any) {
    this.messages.push({
      message: `<div class="chat-message-left pb-4">
    <div><img src="https://bootdey.com/img/Content/avatar/avatar3.png" alt="Sharon Lessman" width="40" height="40"
            class="rounded-circle mr-1">
        <div class="text-muted small text-nowrap mt-2">`+ new DatePipe("en-us").transform(date, "shortTime") + `</div>
    </div>
    <div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
        <div class="font-weight-bold mb-1">`+userName+`</div> `+ message + `
    </div>
    </div>`, "date": new Date(date), class: "chat-message-left mb-4"
    })
  }

  private createSupportMessageElements(message: string, date: number,userName:any) {
    this.messages.push({
      message: `
    <div><img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="Chris Wood" width="40" height="40"
            class="rounded-circle mr-1">
        <div class="text-muted small text-nowrap mt-2">`+ new DatePipe("en-us").transform(date, "shortTime") + `</div>
    </div>
    <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
        <div class="font-weight-bold mb-1">`+userName+`</div> `+ message + `
    </div>
 `, "date": new Date(date), "class": "chat-message-right mb-4"
    })
  }
}