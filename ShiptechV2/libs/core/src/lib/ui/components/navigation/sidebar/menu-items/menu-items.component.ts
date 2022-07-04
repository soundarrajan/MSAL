import { Component, Input, ViewChild } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { LayoutMainComponent } from '@shiptech/core/ui/layout/main/layout-main.component';
//import { SidebarComponent } from '../sidebar.component';
import { MenuItem } from 'primeng/api';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ScrollPanel } from 'primeng/scrollpanel';

@Component({
  /* tslint:disable:component-selector */
  selector: '[shiptech-menu-items]',
  /* tslint:enable:component-selector */
  templateUrl: './menu-items.component.html',
  animations: [
    trigger('children', [
      state(
        'hiddenAnimated',
        style({
          height: '0px'
        })
      ),
      state(
        'visibleAnimated',
        style({
          height: '*'
        })
      ),
      state(
        'visible',
        style({
          height: '*',
          'z-index': 100
        })
      ),
      state(
        'hidden',
        style({
          height: '0px',
          'z-index': '*'
        })
      ),
      transition(
        'visibleAnimated => hiddenAnimated',
        animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')
      ),
      transition(
        'hiddenAnimated => visibleAnimated',
        animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')
      )
    ])
  ]
})
export class AppSubMenuComponent {
  @Input() item: MenuItem;

  @Input() root: boolean;

  @Input() visible: boolean;

  @ViewChild('layoutMenuScroller', { static: true })
  layoutMenuScrollerViewChild: ScrollPanel;

  _parentActive: boolean;

  _reset: boolean;

  activeIndex: number;

  constructor(
    public app: LayoutMainComponent,
    public appConfig: AppConfig
  ) {}

  itemClick(event: Event, item: MenuItem, index: number): boolean {
    if (this.root) {
      this.app.menuHoverActive = !this.app.menuHoverActive;
    }

    // avoid processing disabled items
    if (item.disabled) {
      event.preventDefault();
      return true;
    }

    // activate current item and deactivate active sibling if any
    this.activeIndex = this.activeIndex === index ? null : index;

    // execute command
    if (item.command) {
      item.command({ originalEvent: event, item });
    }

    // prevent hash change
    if (item.items || (!item.url && !item.routerLink)) {
      setTimeout(() => {
        //this.appMenu.layoutMenuScrollerViewChild.moveBar();
        this.layoutMenuScrollerViewChild.moveBar();
      }, 450);
      event.preventDefault();
    }

    // hide menu
    if (!item.items) {
      this.app.resetMenu = this.app.isHorizontal() || this.app.isSlim();

      this.app.overlayMenuActive = false;
      this.app.staticMenuMobileActive = false;
      this.app.staticMenuDesktopInactive = true;
      this.app.menuHoverActive = !this.app.menuHoverActive;
      this.app.unblockBodyScroll();
    }
  }

  onMouseEnter(index: number): void {
    if (
      this.root &&
      this.app.menuHoverActive &&
      (this.app.isHorizontal() || this.app.isSlim()) &&
      !this.app.isMobile() &&
      !this.app.isTablet()
    ) {
      this.activeIndex = index;
    }
  }

  isActive(index: number): boolean {
    return this.activeIndex === index;
  }

  @Input() get reset(): boolean {
    return this._reset;
  }

  set reset(val: boolean) {
    this._reset = val;
    if (this._reset && (this.app.isHorizontal() || this.app.isSlim())) {
      this.activeIndex = null;
    }
  }

  @Input() get parentActive(): boolean {
    return this._parentActive;
  }

  set parentActive(val: boolean) {
    this._parentActive = val;
    if (!this._parentActive) {
      this.activeIndex = null;
    }
  }
}
