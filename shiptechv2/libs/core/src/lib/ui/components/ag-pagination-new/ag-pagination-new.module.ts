import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SpinnerModule } from 'primeng/spinner';
import { AgPaginationNewComponent } from './ag-pagination-new.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    SpinnerModule,
    NgxPaginationModule
  ],
  declarations: [AgPaginationNewComponent],
  exports: [DropdownModule, AgPaginationNewComponent]
})
export class AgPaginationNewModule {}
