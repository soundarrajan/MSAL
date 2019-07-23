import { Component, Input, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ScrollPanel } from 'primeng/primeng';
import { MainComponent } from '../../main.component';
import { menuItems } from '../models/menu.items';

@Component({
    selector: 'shiptech-sidebar',
    templateUrl: './sidebar.component.html',
    animations: [
        trigger('inline', [
            state('hiddenAnimated', style({
                height: '0px',
                overflow: 'hidden'
            })),
            state('visibleAnimated', style({
                height: '*',
            })),
            transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ],
  styles: [`
    .menu-title {
      color: #75808e;
      font-size: 15px;
      font-weight: 600;
      margin: 17px 10px;
      display: inline-block;
    }`]
})
export class SidebarComponent implements OnInit, AfterViewInit {

    @Input() reset: boolean;

    model: any[];

    inlineUserMenuActive = false;

    @ViewChild('layoutMenuScroller', { static: true }) layoutMenuScrollerViewChild: ScrollPanel;

    constructor(public app: MainComponent) { }

    ngOnInit() {
      this.model = menuItems;
    }

    ngAfterViewInit() {
        setTimeout(() => { this.layoutMenuScrollerViewChild.moveBar(); }, 100);
    }

    changeTheme(theme: string) {
        const layoutLink: HTMLLinkElement = document.getElementById('layout-css') as HTMLLinkElement;
        layoutLink.href = 'assets/layout/css/layout-' + theme + '.css';
        const themeLink: HTMLLinkElement = document.getElementById('theme-css') as HTMLLinkElement;
        themeLink.href = 'assets/theme/' + 'theme-' + theme + '.css';
    }

    changeTopbarColor(topbarColor, logo) {
        this.app.topbarColor = topbarColor;
        const topbarLogoLink: HTMLImageElement = document.getElementById('topbar-logo') as HTMLImageElement;
        topbarLogoLink.src = 'assets/layout/images/' + logo + '.svg';
    }

    onMenuClick(event) {
        if (!this.app.isHorizontal()) {
            setTimeout(() => {
                // this.layoutMenuScrollerViewChild.moveBar();
            }, 450);
        }
        this.app.onMenuClick(event);
    }
}
