import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private socket: Socket) { }

  async connect() {
    this.socket.emit('connection');
  }

  disconnect() {
    this.socket.emit('disconnectx');
  }

  joinTwoParam(roomName:string,userData:string){
    console.log("joining "+roomName)
    this.socket.emit("join",roomName,userData)
  }

  join(roomName:string){
    console.log("joining "+roomName)
    this.socket.emit("join",roomName)
  }
  joinToRoom(roomName:string){
    console.log("joining to room "+roomName)
    this.socket.emit("join to room",roomName)
  }
  
  sendSupportMessage(message:string,roomName:string,userData:string){
    this.socket.emit("support message",{"message":message,"roomName":roomName},userData)
  }

  sendMessage(message:string,roomName:string,userData:any){
    this.socket.emit("message",{"message":message,"roomName":roomName},userData)
  }

}
