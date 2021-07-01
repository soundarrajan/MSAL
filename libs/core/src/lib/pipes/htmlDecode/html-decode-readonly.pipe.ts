import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'htmlDecodeReadonly'
})
export class HtmlDecodeReadonly implements PipeTransform {
  transform(str: any, property?: string): any {
    var decode = function(str) {
      return str.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
      });
    };
    if (str && str[property]) {
      str[property] = decode(_.unescape(str[property]));
      return str;
    }
    return decode(_.unescape(str));
  }
}
