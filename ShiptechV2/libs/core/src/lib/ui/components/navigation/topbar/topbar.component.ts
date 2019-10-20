import { Component } from '@angular/core';
import { LayoutMainComponent } from '../../../layout/main/layout-main.component';
import { AuthenticationService } from '../../../../authentication/authentication.service';
import { BreadcrumbsService } from '../../breadcrumbs/breadcrumbs.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'shiptech-topbar',
  templateUrl: './topbar.component.html'
})
export class TopbarComponent {

  public pageTitle$: Observable<string>;

  constructor(public app: LayoutMainComponent, public authService: AuthenticationService, breadcrumbService: BreadcrumbsService, titleService: Title) {
    this.pageTitle$ = breadcrumbService.get().pipe(map(breadcrumbs => (_.last(breadcrumbs) || { label: ''}).label), tap(title => titleService.setTitle(title)));
  }
}
