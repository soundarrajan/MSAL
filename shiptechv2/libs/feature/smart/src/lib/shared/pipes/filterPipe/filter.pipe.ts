import { Injector, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {

  public constructor(private readonly injector: Injector) {
  }

  transform(value: Array<any>, searchText: string = null): any {
    if (searchText)
      return value.filter(e => e.planId.indexOf(searchText)>-1);
    else
      return value;
  }

}
