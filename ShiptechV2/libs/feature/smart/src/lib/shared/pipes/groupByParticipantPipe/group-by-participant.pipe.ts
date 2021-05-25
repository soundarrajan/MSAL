import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupByParticipant'
})
export class GroupByParticipantPipe implements PipeTransform {

  transform(DataList: any[], searchText: string, args: any, args2: any): any {
    args = args.split('.');
    let DuplicateFilterArr = [];
    if(searchText && searchText.trim()) {
      return DataList.filter(item => {
        if(!(DuplicateFilterArr.includes(item[args[0]][args[1]]))){
          DuplicateFilterArr.push(item[args[0]][args[1]]);
          return (((item[args[0]][args[1]]).toLowerCase()).indexOf((searchText.toLowerCase()))>-1) || (((item[args2]).toLowerCase()).indexOf((searchText.toLowerCase()))>-1)
        }
      });
    } else {
      return DataList;
    }
  }

}
