import { MenuItem } from 'primeng/api';
import { Omit } from 'yargs';
import * as _ from 'lodash';

export type MappedMenuItems = Record<string, MenuItemMap>;

export interface MenuItemMap extends Omit<MenuItem, 'items'> {
  items: MappedMenuItems;
}

export class SidebarViewModel {
  items: MenuItem[];
  baseMenu: MappedMenuItems;

  // constructor(public baseMenu: MappedMenuItems) {
  constructor() {}

  public set patchMenu(patch: MappedMenuItems) {
    const merged = _.merge(this.baseMenu, patch);
    this.items = this.transform(merged);
  }

  private transform(menuMap: MappedMenuItems): MenuItem[] {
    return [];
    // return _.values(menuMap).map(item => {
    //   if (!item.items) {
    //     return item;
    //   }
    //
    //   return this.transform(item.items);
    // });
  }
}
