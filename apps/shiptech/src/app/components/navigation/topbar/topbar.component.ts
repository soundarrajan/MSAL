import { Component } from '@angular/core';
import { MainComponent } from '../../main.component';
import { AuthenticationService } from '@shiptech/core';
import { BreadcrumbsService } from '../../../../../../../libs/core/src/lib/shared/breadcrumbs/breadcrumbs.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'shiptech-topbar',
  templateUrl: './topbar.component.html'
})
export class TopbarComponent {

  public pageTitle$: Observable<string>;

  constructor(public app: MainComponent, public authService: AuthenticationService, breadcrumbService: BreadcrumbsService) {
    this.pageTitle$ = breadcrumbService.get().pipe(map(breadcrumbs => _.last(breadcrumbs).label));
  }
}
