import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgPagingComponent } from '../ag-paging/ag-paging.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SpinnerModule } from 'primeng/spinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    SpinnerModule
  ],
  declarations: [AgPagingComponent],
  exports: [DropdownModule, AgPagingComponent]
})
export class AgPagingModule {}
