import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { DatabaseManipulation } from '@shiptech/core/legacy-cache/database-manipulation.service';
import { IScheduleDashboardLabelConfigurationWithPromiseDto } from '@shiptech/core/lookups/schedule-dashboard-label-configuration.dto.interface';

@Component({
  selector: 'ag-grid-cell-status',
  templateUrl: './ag-grid-cell-status.component.html',
  styleUrls: ['./ag-grid-cell-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AGGridCellRendererStatusComponent
  implements ICellRendererAngularComp {
  public params: any;

  constructor(public router: Router, public dialog: MatDialog) {}

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }
}
