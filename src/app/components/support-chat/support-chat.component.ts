import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-support-chat',
  templateUrl: './support-chat.component.html',
  styleUrls: ['./support-chat.component.css']
})
export class SupportChatComponent implements OnInit,OnDestroy {

  messages:string;
  private _subscription: Subscription;
 
  /*
  MessageService, Constructor Injection ile içeriye alınır.
  */
  constructor(private messageService: MessageService,private socket:Socket) { }
 
  /*
  Bileşen initialize edilirken güncel makale için bir abonelik başlatılır.
  Böylece gerek bu aboneliğin sahibinin değişiklikleri
  gerek diğerlerinin değişiklikleri aynı makalede çalışan herkese yansır.
  */
  ngOnInit() {
    this.connect();
    this.socket.on("chat message",(message:any)=>{
      this.messages+= "<li>"+message+"</li>"
    })
  }
 
  // Bileşen ölürken üzerinde çalışan makalenin aboneliğinden çıkılır
  ngOnDestroy() {
    this._subscription.unsubscribe();
    this.messageService.disconnect();
  }
 
  /*
   Arayüzdeki keyup olayı ile bağlanmıştır
  Yani tuştan parmak kaldırdıkça servise bir güncelleme olayı fırlatılır 
  ki bu tüm abonelerce alınır.
  */
  connect() {
    this.messageService.connect();
  }
  
}
