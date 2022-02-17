import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  rooms= this.socket.fromEvent<string[]>("rooms")

  constructor(private socket: Socket) { }

  connect() {
    this.socket.emit('connection');
  }

  disconnect() {
    this.socket.emit('disconnect');
  }

  join(roomName:string){
    console.log("joining "+roomName)
    this.socket.emit("join",roomName)
  }
  
  sendSupportMessage(message:string,roomName:string){
    this.socket.emit("support message",{"message":message,"roomName":roomName})
  }

  sendMessage(message:string,roomName:string){
    this.socket.emit("message",{"message":message,"roomName":roomName})
  }

}
