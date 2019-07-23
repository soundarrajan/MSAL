import { MenuItem } from 'primeng/api';
import * as _ from 'lodash';

export interface OrderedMenuItem extends  MenuItem {
  order?: number;
}
export type KeyedMenuItems = Record<string, KeyedMenuItem>;

//TODO: Move to proper core types
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export interface KeyedMenuItem extends Omit<OrderedMenuItem, 'items'> {
  items?: KeyedMenuItems;
}

//TODO: Rename file, move to where it's supposed to be
export function transformMenu(baseMenu: KeyedMenuItems, patchMenu: KeyedMenuItems): MenuItem[] {

  const mergedMenu: KeyedMenuItems = _.merge(baseMenu, patchMenu );

  let itemsToArray: (obj: KeyedMenuItems) => MenuItem[];

  itemsToArray = (obj: KeyedMenuItems) => {

    return _.values(obj).map(i => ({ ...i, items: itemsToArray(i.items) }));
  };

  return  itemsToArray(mergedMenu);
}
