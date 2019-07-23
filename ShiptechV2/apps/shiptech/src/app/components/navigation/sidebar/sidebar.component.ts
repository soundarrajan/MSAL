import { AfterContentInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MainComponent } from '../../main.component';
import { BASE_MENU } from '../models/menu.items';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ScrollPanel } from 'primeng/primeng';
import { transformMenu } from '../models/sidebar-view.model';
import * as jp from 'jsonpath';

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
        height: '*'
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
export class SidebarComponent implements OnInit, AfterContentInit {

  @Input() reset: boolean;

  model: any[];

  @ViewChild('layoutMenuScroller', { static: true }) layoutMenuScrollerViewChild: ScrollPanel;

  constructor(public app: MainComponent) {
  }

  ngOnInit() {
    // TODO: replace this with values from tenant settings
    // TODO: TsList disable double qoues
    jp.value(BASE_MENU, 'masters.items.company.label', 'Company');
    jp.value(BASE_MENU, 'masters.items.company.items.company_list.label', 'Company List');
    jp.value(BASE_MENU, 'masters.items.company.items.new_company.label', 'New Company');

    this.model = transformMenu(BASE_MENU, {
        'masters': {
          items: {
            // 'company': {
            //   label: 'Company',
            //   items: {
            //     'company_list': {
            //       label: 'Company List'
            //     },
            //     'new_company': {
            //       label: 'New Company'
            //     }
            //   }
            // },
            'service': {
              label: 'Service',
              items: {
                'service_list': {
                  label: 'Service List'
                },
                'new-service': {
                  label: 'New Service'
                }
              }
            }
          }
        },
        'invoices': {
          label: 'Invoices',
          items: {
            'invoice_list': {
              label: 'Invoice List'
            }
          }
        }
      }
    );
  }

  ngAfterContentInit() {
    setTimeout(() => {
      this.layoutMenuScrollerViewChild.style = {height: '100%'};
      this.layoutMenuScrollerViewChild.moveBar();
    }, 100);
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
        this.layoutMenuScrollerViewChild.moveBar();
      }, 450);
    }
    this.app.onMenuClick(event);
  }
}
