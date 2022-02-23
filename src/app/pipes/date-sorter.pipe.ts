import { Message } from '../models/message';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateSorter'
})
export class DateSorterPipe implements PipeTransform {

  transform(messages: Message[]): Message[] {

    for (let i = 0; i < messages.length; i++) {
      messages.sort((a: any, b: any) => {
        if (a.date < b.date) {
          return -1;
        } else if (a.date > b.date) {
          return 1;
        } else {
          return 0;
        }
      });
    }
    return messages;

  }

}
