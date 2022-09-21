import { NgModule } from '@angular/core';
import { SearchBoxComponent } from './search-box.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectTextOnFocusDirectiveModule } from '../../directives/default/select-text-on-focus.directive';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    CommonModule,
    SelectTextOnFocusDirectiveModule
  ],
  declarations: [SearchBoxComponent],
  exports: [SearchBoxComponent]
})
export class SearchBoxModule {}
