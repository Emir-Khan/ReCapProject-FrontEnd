import { Pipe, PipeTransform } from '@angular/core';
import { Car } from '../models/car';

@Pipe({
  name: 'hasImage'
})
export class HasImagePipe implements PipeTransform {
  data:Car[] = []
  transform(value: Car[],filtered:boolean): Car[] {
    this.data=[]
    for (let i = 0; i < value.length; i++) {
      if (!filtered) {
        if (value[i].hasImage ==true) this.data.push(value[i])  
      }else{
        return value
      }
    }
    return this.data
  }

}
