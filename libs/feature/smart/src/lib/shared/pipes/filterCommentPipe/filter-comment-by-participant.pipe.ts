import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCommentByParticipant'
})
export class FilterCommentByParticipantPipe implements PipeTransform {

  transform(itemList: any, ...args: any): any {
    if(args[1] && args[1].trim()) {
      let pathKeys = args[0].split('.');
      return itemList.filter(item => (item[pathKeys[0]][pathKeys[1]]==args[1]));
    } else {
      return itemList;
    }
  }

}
