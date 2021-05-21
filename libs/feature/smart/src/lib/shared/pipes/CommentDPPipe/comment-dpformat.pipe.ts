import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commentDPFormat'
})
export class CommentDPFormatPipe implements PipeTransform {

  transform(participant: string = null): unknown {
    if (participant) {
      let DPNameArr = participant.toString().split(' ')
      let DPName = DPNameArr.map((name)=>name.charAt(0));
      return DPName.join('').toUpperCase();
    } else {
      return 'N/A';
    }
  }

}
