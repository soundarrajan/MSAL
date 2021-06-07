import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enUsDatePipe'
})
export class EnUsDatePipePipe implements PipeTransform {
  //Convert EN US invalid date format into valid EN US date format 
  transform(dateToFormat: any, ...args: unknown[]): Date {
    let ScrubberDateTimeArr = dateToFormat.split(' ');
      let ScrubberDateFormat = ScrubberDateTimeArr.slice(0,3).join(' ').concat(',');
      let YearTimeArr = ScrubberDateTimeArr.slice(3,5);
      let TimeFormat = YearTimeArr.toString().slice(0,-2)
      YearTimeArr = YearTimeArr.join().slice(-2);
      return ScrubberDateFormat.concat(TimeFormat, ' ', YearTimeArr);
  }

}
