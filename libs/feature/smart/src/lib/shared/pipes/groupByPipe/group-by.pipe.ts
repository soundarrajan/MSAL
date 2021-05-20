import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupBy'
})
export class GroupByPipe implements PipeTransform {
  groupByArr = [];
  groupByPropArr = [];
  checkKeyExist(item, props) {
    for(var key in item) {
      console.log(item[key]);
      if(item[key] instanceof Object) {
        console.log(item[key]);
        if(item[key].hasOwnProperty(props)) {
          if(this.groupByPropArr.includes(item[props])) {
            this.groupByPropArr.push(item[props])
            this.groupByArr.push(item);
          }
        }
      } else if(Array.isArray(item[key])) {
        this.checkKeyExist(item[key], props);
      }
    }
  }
  transform(
    DataList: any[], args: any): any {
    if(args && DataList.length) {
      let GroupedDataList = DataList.forEach((item, index) => {
        if(item && item.hasOwnProperty(args)) {
          console.log(item.args);
          if(this.groupByPropArr.includes(item[args])) {
            this.groupByPropArr.push(item[args])
            this.groupByArr.push(item);
          }
        } else {
          this.checkKeyExist(item, args);
        }
     });
      return this.groupByPropArr;
    } else {
      return this.groupByPropArr;
    }
  }

}
