import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ExportNewComponent } from './export-new.component';

@NgModule({
  imports: [CommonModule, ButtonModule],
  declarations: [ExportNewComponent],
  exports: [ExportNewComponent]
})
export class ExportNewModule {}
