import {
  AfterContentInit,
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { LayoutMainComponent } from '@shiptech/core/ui/layout/main/layout-main.component';
import { BASE_MENU } from '../models/menu.items';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { transformMenu } from '../models/sidebar-view.model';
import * as jp from 'jsonpath';
import { ScrollPanel } from 'primeng/scrollpanel';
import { AppConfig } from '@shiptech/core/config/app-config';

@Component({
  selector: 'shiptech-sidebar',
  templateUrl: './sidebar.component.html',
  animations: [
    trigger('inline', [
      state(
        'hiddenAnimated',
        style({
          height: '0px',
          overflow: 'hidden'
        })
      ),
      state(
        'visibleAnimated',
        style({
          height: '*'
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
  ],
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterContentInit {
  @Input() reset: boolean;

  model: any[];

  @ViewChild('layoutMenuScroller', { static: true })
  layoutMenuScrollerViewChild: ScrollPanel;

  constructor(public app: LayoutMainComponent, private appConfig: AppConfig) {}

  ngOnInit(): void {
    // TODO: replace this with values from tenant settings
    // TODO: TsList disable double qoues
    jp.value(BASE_MENU, 'masters.items.company.label', 'Company');
    jp.value(
      BASE_MENU,
      'masters.items.company.items.company_list.label',
      'Company List'
    );
    jp.value(
      BASE_MENU,
      'masters.items.company.items.new_company.label',
      'New Company'
    );

    if (!this.appConfig.v1.tenantConfigs.showCalenderView) {
      const dashBoardItems = jp.query(
        BASE_MENU,
        'procurement.items.schedule_dashboard.items[?(!@.schedule_dashboard_calendar)]'
      );
      jp.value(
        BASE_MENU,
        'procurement.items.schedule_dashboard.items',
        dashBoardItems.splice(1)
      );
    }

    this.model = transformMenu(BASE_MENU, {
      masters: {
        items: {
          service: {
            label: 'Service',
            items: {
              service_list: {
                label: 'Service List'
              },
              new_service: {
                label: 'New Service'
              }
            }
          }
        }
      }
    });
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.layoutMenuScrollerViewChild.style = { height: '100%' };
      this.layoutMenuScrollerViewChild.moveBar();
    }, 100);
  }

  onMenuClick(event: any): void {
    if (!this.app.isHorizontal()) {
      setTimeout(() => {
        this.layoutMenuScrollerViewChild.moveBar();
      }, 450);
    }
    this.app.onMenuClick(event);
  }
}
