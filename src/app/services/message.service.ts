import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  public currentMessage = this.socket.fromEvent<Message>('ready');
  public allOfThem = this.socket.fromEvent<string[]>('warnEveryone');

  constructor(private socket: Socket) { }

  connect() {
    this.socket.emit('connection');
  }
  disconnect() {
    this.socket.emit('disconnect');
  }
  get(id: string) {
    this.socket.emit('get', id);
  }
}
