import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DatabaseManipulation } from '@shiptech/core/legacy-cache/database-manipulation.service';
import { IScheduleDashboardLabelConfigurationWithPromiseDto } from '@shiptech/core/lookups/schedule-dashboard-label-configuration.dto.interface';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { MatDialog } from '@angular/material/dialog';
import { ControlTowerModalComponent } from '../../control-tower-modal/control-tower-modal.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-ag-open-pop-up',
  templateUrl: './ag-open-pop-up.component.html',
  styleUrls: ['./ag-open-pop-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgOpenPopUpComponent implements OnInit, ICellRendererAngularComp {
  initParamsValues: any;
  email: any;

  constructor(
    private databaseManipulation: DatabaseManipulation,
    public dialog: MatDialog
  ) {}

  async agInit(params: any): Promise<void> {
    this.initParamsValues = params.data;
  }

  refresh(params: any): boolean {
    /** Get the cell to refresh. Return true if successful. Return false if not (or you don't have refresh logic),
     * then the grid will refresh the cell for you. */

    return true;
  }

  ngOnInit(): void {}

  openRaiseClaimDialog(): void {
    const dialogRef = this.dialog.open(ControlTowerModalComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.email = result;
    });
  }
}
