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
  selector: 'ag-grid-cell-renderer-status',
  templateUrl: './ag-grid-cell-async-status.component.html',
  styleUrls: ['./ag-grid-cell-async-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AGGridCellRendererAsyncStatusComponent
  implements ICellRendererAngularComp {
  initParamsValues: IScheduleDashboardLabelConfigurationWithPromiseDto;
  public params: any;

  constructor(
    public router: Router,
    public dialog: MatDialog,
    private databaseManipulation: DatabaseManipulation
  ) {}

  async agInit(params: any) {
    await this.initValues(params);
  }

  async initValues(params: any): Promise<void> {
    this.initParamsValues = params.value;
    this.initParamsValues.code = this.returnColor();
  }

  async returnColor(): Promise<string> {
    return this.databaseManipulation.getStatusColorFromDashboard(
      this.initParamsValues.id,
      this.initParamsValues.transactionTypeId
    );
  }

  refresh(): boolean {
    return false;
  }
}
