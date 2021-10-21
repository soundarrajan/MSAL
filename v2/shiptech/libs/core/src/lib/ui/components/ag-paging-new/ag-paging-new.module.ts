import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SpinnerModule } from 'primeng/spinner';
import { AgPagingNewComponent } from './ag-paging-new.component';
import { MaterialModule } from '../../material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    SpinnerModule,
    MaterialModule
  ],
  declarations: [AgPagingNewComponent],
  exports: [DropdownModule, AgPagingNewComponent]
})
export class AgPagingNewModule {}
