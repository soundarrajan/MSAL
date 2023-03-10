import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCommentByParticipant'
})
export class FilterCommentByParticipantPipe implements PipeTransform {

  transform(itemList: any, ...args: any): any {
    if(args[1] && args[1].trim()) {
      let pathKeys = args[0].split('.');
      if(pathKeys.length==2) {
        itemList = itemList.filter(item => ((item[pathKeys[0]][pathKeys[1]]).toLowerCase()==args[1].toLowerCase()));
        return itemList.length? itemList: [-1];
      } else {
        itemList = itemList.filter(item => ((item[pathKeys[0]]).toLowerCase().indexOf(args[1].toLowerCase())>-1));
        return itemList.length? itemList: [-1];
      }
    } else {
      return itemList;
    }
  }

}
