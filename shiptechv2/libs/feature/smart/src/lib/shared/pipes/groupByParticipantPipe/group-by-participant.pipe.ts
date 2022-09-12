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
          let partipantSearch = (((item[args[0]][args[1]]).toLowerCase()).indexOf((searchText.toLowerCase()))>-1);
          let commentSearch = (((item[args2]).toLowerCase()).indexOf((searchText.toLowerCase()))>-1);
          if(partipantSearch || commentSearch) {
            DuplicateFilterArr.push(item[args[0]][args[1]]);
            return true;
          }
        }
      });
    } else {
      return DataList.filter(item => {
        if(!(DuplicateFilterArr.includes(item[args[0]][args[1]]))){
          DuplicateFilterArr.push(item[args[0]][args[1]]);
          return true;
        }
      });
    }
  }

}
