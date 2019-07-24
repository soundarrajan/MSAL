import { actionMatcher } from '@ngxs/store';
import { Type } from '@angular/core';

export function isAction<T>(actionInstance: any, actionType: T): actionType is T {
  return actionMatcher(actionInstance)(actionType);
}

export function asAction<T>(actionInstance: T, actionType: Type<T>): T {
  return actionMatcher(actionInstance)(actionType) ? actionInstance : undefined;
}

export interface IOrderlyStoreEntity {
  entityOrderInStore: number;
}
