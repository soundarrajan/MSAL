import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportComponent } from '@shiptech/core/ui/components/export/export.component';
import { ButtonModule } from 'primeng/button';

@NgModule({
  imports: [CommonModule, ButtonModule],
  declarations: [ExportComponent],
  exports: [ExportComponent]
})
export class ExportModule {}
