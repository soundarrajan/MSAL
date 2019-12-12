import * as _ from 'lodash';
import { Omit } from '@shiptech/core/utils/type-definitions';
import { MenuItem } from 'primeng';

export interface OrderedMenuItem extends MenuItem {
  order?: number;
}

export type KeyedMenuItems = Record<string, KeyedMenuItem>;

export interface KeyedMenuItem extends Omit<OrderedMenuItem, 'items'> {
  items?: KeyedMenuItems;
}

//TODO: Rename file, move to where it's supposed to be
export function transformMenu(baseMenu: KeyedMenuItems, patchMenu: KeyedMenuItems): MenuItem[] {

  const mergedMenu: KeyedMenuItems = _.merge(baseMenu, patchMenu);

  let itemsToArray: (obj: KeyedMenuItems) => MenuItem[];

  itemsToArray = (obj: KeyedMenuItems) => {
    return _.values(obj).map(i => {
      const children = itemsToArray(i.items);
      const { items: __, ...menuItemProps } = i;

      // Note: It's important for leaf menu items to not have items property
      if (children && children.length) {
        return { items: children, ...menuItemProps };
      }
      return menuItemProps;
    });
  };

  return itemsToArray(mergedMenu);
}
