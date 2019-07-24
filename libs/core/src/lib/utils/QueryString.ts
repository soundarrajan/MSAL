import * as qs from 'qs';

export function toQueryString(source: any, options?: any): string {
  return qs.stringify(source, { allowDots: true, encode: true, ...options });
}
