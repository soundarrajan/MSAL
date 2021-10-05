import { AfterViewInit, Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'layout-main',
  templateUrl: './layout-main.component.html'
})
export class LayoutMainComponent implements AfterViewInit {

  menuMode = 'static';

  overlayMenuActive: boolean;

  staticMenuDesktopInactive: boolean = true;

  staticMenuMobileActive: boolean;

  layoutMenuScroller: HTMLDivElement;

  lightMenu = true;

  topbarColor = 'layout-topbar-light';

  menuClick: boolean;

  userMenuClick: boolean;

  notificationMenuClick: boolean;

  rightMenuClick: boolean;

  resetMenu: boolean;

  menuHoverActive: boolean;

  topbarUserMenuActive: boolean;

  topbarNotificationMenuActive: boolean;

  rightPanelMenuActive: boolean;

  inlineUser: boolean;

  isRTL: boolean;
  isEmailTemplateEditor: boolean = false;
  moduleLoaded: any;
  isDelivery: boolean = false;
  isInvoicesplitview: boolean = false;

  constructor(private router: Router) {
    this.isDelivery = false;
    if (this.router.url.includes('email-template-editor')) {
      this.isEmailTemplateEditor = true;
    }
    if (this.router.url.includes('delivery')
          || this.router.url.includes('contract')
          || this.router.url.includes('invoices/edit')
          || this.router.url.includes('group-of-requests')) {
        this.isDelivery = true;
    }
    if (this.router.url.includes('split-view')) {
      this.isDelivery = true;
    }
  }

  onLayoutClick(): void {
    if (!this.userMenuClick) {
      this.topbarUserMenuActive = false;
    }

    if (!this.notificationMenuClick) {
      this.topbarNotificationMenuActive = false;
    }

    if (!this.rightMenuClick) {
      this.rightPanelMenuActive = false;
    }

    if (!this.menuClick) {
      if (this.isHorizontal() || this.isSlim()) {
        this.resetMenu = true;
      }

      if (this.overlayMenuActive || this.staticMenuMobileActive) {
        this.hideOverlayMenu();
      }

      this.menuHoverActive = false;
      this.unblockBodyScroll();
    }

    this.userMenuClick = false;
    this.rightMenuClick = false;
    this.notificationMenuClick = false;
    this.menuClick = false;
  }

  onMenuButtonClick(event: any): void {
    this.menuClick = true;
    this.topbarUserMenuActive = false;
    this.topbarNotificationMenuActive = false;
    this.rightPanelMenuActive = false;

    if (this.isOverlay()) {
      this.overlayMenuActive = !this.overlayMenuActive;
    }

    if (this.isDesktop()) {
      this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
    } else {
      this.staticMenuMobileActive = !this.staticMenuMobileActive;
      if (this.staticMenuMobileActive) {
        this.blockBodyScroll();
      } else {
        this.unblockBodyScroll();
      }
    }

    event.preventDefault();
  }

  onMenuClick($event: any): void {
    this.menuClick = true;
    this.resetMenu = false;
  }

  onTopbarUserMenuButtonClick(event: any): void {
    this.userMenuClick = true;
    this.topbarUserMenuActive = !this.topbarUserMenuActive;

    this.hideOverlayMenu();

    event.preventDefault();
  }

  onTopbarNotificationMenuButtonClick(event: any): void {
    this.notificationMenuClick = true;
    this.topbarNotificationMenuActive = !this.topbarNotificationMenuActive;

    this.hideOverlayMenu();

    event.preventDefault();
  }

  onRightMenuClick(event: any): void {
    this.rightMenuClick = true;
    this.rightPanelMenuActive = !this.rightPanelMenuActive;

    this.hideOverlayMenu();

    event.preventDefault();
  }

  onTopbarSubItemClick(event: any): void {
    event.preventDefault();
  }

  isHorizontal(): boolean {
    return this.menuMode === 'horizontal';
  }

  isSlim(): boolean {
    return this.menuMode === 'slim';
  }

  isOverlay(): boolean {
    return this.menuMode === 'overlay';
  }

  isStatic(): boolean {
    return this.menuMode === 'static';
  }

  isMobile(): boolean {
    return window.innerWidth < 1025;
  }

  isDesktop(): boolean {
    return window.innerWidth > 896;
  }

  isTablet(): boolean {
    const width = window.innerWidth;
    return width <= 1024 && width > 640;
  }

  hideOverlayMenu(): void {
    this.overlayMenuActive = false;
    this.staticMenuMobileActive = false;
  }

  changeMenuMode(menuMode: string): void {
    this.menuMode = menuMode;
    this.staticMenuDesktopInactive = false;
    this.overlayMenuActive = false;
  }

  blockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.add('blocked-scroll');
    } else {
      document.body.className += ' blocked-scroll';
    }
  }

  unblockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.remove('blocked-scroll');
    } else {
      document.body.className = document.body.className.replace(
        new RegExp(
          '(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)',
          'gi'
        ),
        ' '
      );
    }
  }

  ngAfterViewInit(): void {}
}
