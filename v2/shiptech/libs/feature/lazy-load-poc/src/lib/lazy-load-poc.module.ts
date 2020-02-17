import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLazyLoadComponent } from './views/main-lazy-load.component';
import { LazyLoadPocRoutingModule } from './lazy-load-poc-routing.module';
import { UIModule } from '../../../../core/src/lib/ui/ui.module';
import { LazyViewComponent } from './views/lazy-view/lazy-view.component';
import { LazyLoadPocRouteResolver } from './lazy-load-poc-route.resolver';

@NgModule({
  imports: [CommonModule, LazyLoadPocRoutingModule, UIModule],
  declarations: [MainLazyLoadComponent, LazyViewComponent],
  providers: [LazyLoadPocRouteResolver],
  exports: [MainLazyLoadComponent]
})
export class LazyLoadPocModule {}
