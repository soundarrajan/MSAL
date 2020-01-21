import { NgModule } from '@angular/core';
import { SearchBoxComponent } from './search-box.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/primeng';
import { CommonModule } from '@angular/common';
import { SelectTextOnFocusDirectiveModule } from '../../directives/default/select-text-on-focus.directive';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    CommonModule,
    SelectTextOnFocusDirectiveModule
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
