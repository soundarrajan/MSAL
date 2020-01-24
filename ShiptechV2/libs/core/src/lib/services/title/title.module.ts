import { APP_INITIALIZER, NgModule } from "@angular/core";
import { titleInitializer, TitleService } from "@shiptech/core/services/title/title.service";


@NgModule({
  imports: [],
  providers: [
    TitleService,
    {
      provide: APP_INITIALIZER,
      useFactory: titleInitializer,
      multi: true,
      deps: [TitleService]
    }
  ]
})
export class TitleModule {
}
