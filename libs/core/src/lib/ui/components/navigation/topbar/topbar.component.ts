import { ChangeDetectionStrategy, Component } from "@angular/core";
import { LayoutMainComponent } from "../../../layout/main/layout-main.component";
import { AuthenticationService } from "../../../../authentication/authentication.service";
import { Observable } from "rxjs";
import { Title } from "@angular/platform-browser";
import { Select } from "@ngxs/store";
import { UserProfileState } from "@shiptech/core/store/states/user-profile/user-profile.state";

@Component({
  selector: "shiptech-topbar",
  templateUrl: "./topbar.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent {

  public pageTitle: Title;

  @Select(UserProfileState.displayName) displayName$: Observable<string>;
  @Select(UserProfileState.username) username$: Observable<string>;

  constructor(public app: LayoutMainComponent,
              public authService: AuthenticationService,
              private titleService: Title) {
    this.pageTitle = this.titleService;
  }

}
