import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'utcDatePipe'
})
export class UtcDatePipePipe implements PipeTransform {
  //Convert UTC (YYYY-MM-DD[T]HH:MM:SS[Z]) date format into (yyyy-MM-dd HH:mm) date format 
  transform(dateToFormat: any, ...args: unknown[]): Date {
    if(dateToFormat){
      let dateTimeArr = dateToFormat.split('T');
      let dateFormat = dateTimeArr.slice(0,1)
      let time = dateTimeArr[1];
      if(!time) {
        return dateToFormat;
      }
      let TimeArr = time.split('Z');
      TimeArr = TimeArr.slice(0,1)
      TimeArr =TimeArr[0].split(":");
      dateFormat = dateFormat[0] + " " + TimeArr[0] + ':' +TimeArr[1];
      return dateFormat;
    }
    
  }

}
