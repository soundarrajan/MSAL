import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LayoutMainComponent } from '../../../layout/main/layout-main.component';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { UserProfileState } from '@shiptech/core/store/states/user-profile/user-profile.state';
import { TitleService } from '@shiptech/core/services/title/title.service';
import { AuthService } from '@shiptech/core/authentication/auth.service';

@Component({
  selector: 'shiptech-topbar',
  templateUrl: './topbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent {
  public pageTitle$: Observable<string>;

  @Select(UserProfileState.displayName) displayName$: Observable<string>;
  @Select(UserProfileState.username) username$: Observable<string>;
  smartOperatorURL : string;
  constructor(
    public app: LayoutMainComponent,
    public authService: AuthService,
    titleService: TitleService,
    private store: Store
  ) {
    this.pageTitle$ = titleService.title$;
    this.smartOperatorURL = this.store.selectSnapshot<any>((state: any) => {
      return state.tenantSettings.general.smartTraderLink;
    });
  }
}
