import { Component } from '@angular/core';
import { MainComponent } from '../../main.component';
import { AuthenticationService } from '@shiptech/core';
import { BreadcrumbsService } from '../../../../../../../libs/core/src/lib/shared/breadcrumbs/breadcrumbs.service';
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

  constructor(public app: MainComponent, public authService: AuthenticationService, breadcrumbService: BreadcrumbsService, titleService: Title) {
    this.pageTitle$ = breadcrumbService.get().pipe(map(breadcrumbs => _.last(breadcrumbs).label), tap(title => titleService.setTitle(title)));
  }
}
