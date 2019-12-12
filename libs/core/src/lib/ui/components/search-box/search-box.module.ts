import { NgModule } from '@angular/core';
import { SearchBoxComponent } from './search-box.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputTextModule
  ],
  declarations: [
    SearchBoxComponent
  ],
  exports: [
    SearchBoxComponent
  ]
})
export class SearchBoxModule {
}
