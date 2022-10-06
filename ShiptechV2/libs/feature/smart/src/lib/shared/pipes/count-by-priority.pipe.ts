import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countByPriority'
})
export class CountByPriorityPipe implements PipeTransform {

  transform(masterData: any[], fieldName: string, priorityCode: any): unknown {
    let PriorityCount = [];
    if(!(masterData?.length)) return 0;
    PriorityCount = masterData.filter((item)=> {
      return item[fieldName].toLowerCase() == priorityCode.toLowerCase();
    });
    return (PriorityCount.length)? PriorityCount.length: 0;
  }

}
