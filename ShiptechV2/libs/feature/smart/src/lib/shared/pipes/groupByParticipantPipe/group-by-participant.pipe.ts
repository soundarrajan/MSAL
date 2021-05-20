import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupByParticipant'
})
export class GroupByParticipantPipe implements PipeTransform {

  transform(DataList: any[], args: any, searchText: string): any {
    args = args.split('.');
    if(searchText && searchText.trim()) {
      return DataList.filter(item => (item[args[0]][args[1]].indexOf(searchText)>-1));
    } else {
      return DataList;
    }
  }

}
