import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LayoutMainComponent } from '../../../layout/main/layout-main.component';
import { AuthenticationService } from '../../../../authentication/authentication.service';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { UserProfileState } from '@shiptech/core/store/states/user-profile/user-profile.state';
import { TitleService } from '@shiptech/core/services/title/title.service';

@Component({
  selector: 'shiptech-topbar-adal',
  templateUrl: './topbar-adal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarAdalComponent {
  public pageTitle$: Observable<string>;

  @Select(UserProfileState.displayName) displayName$: Observable<string>;
  @Select(UserProfileState.username) username$: Observable<string>;

  constructor(
    public app: LayoutMainComponent,
    public authService: AuthenticationService,
    titleService: TitleService
  ) {
    this.pageTitle$ = titleService.title$;
  }
}
