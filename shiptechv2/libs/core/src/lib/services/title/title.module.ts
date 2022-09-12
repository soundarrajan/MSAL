import { APP_INITIALIZER, NgModule } from '@angular/core';
import { TitleService } from '@shiptech/core/services/title/title.service';

@NgModule({
  imports: [],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (_: TitleService) => () => {},
      multi: true,
      deps: [TitleService]
    }
  ]
})
export class TitleModule {}
