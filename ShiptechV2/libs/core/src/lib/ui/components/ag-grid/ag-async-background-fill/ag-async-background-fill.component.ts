import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {ICellRendererAngularComp} from "ag-grid-angular";
import {DatabaseManipulation} from "@shiptech/core/legacy-cache/database-manipulation.service";
import {IScheduleDashboardLabelConfigurationDto} from "@shiptech/core/lookups/schedule-dashboard-label-configuration.dto.interface";

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-ag-async-background-fill',
  templateUrl: './ag-async-background-fill.component.html',
  styleUrls: ['./ag-async-background-fill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AgAsyncBackgroundFillComponent implements OnInit, ICellRendererAngularComp {

  private initParamsValues: IScheduleDashboardLabelConfigurationDto;

  constructor(private databaseManipulation: DatabaseManipulation) {}

  async agInit(params: any): Promise<void> {
    this.initParamsValues = params.value;
    this.initParamsValues.code = this.returnColor();
  }

  async returnColor(): Promise<string> {
    return this.databaseManipulation.getStatusColorFromDashboard(this.initParamsValues.id, this.initParamsValues.transactionTypeId);
  }


  refresh(params: any): boolean {
    /** Get the cell to refresh. Return true if successful. Return false if not (or you don't have refresh logic),
     * then the grid will refresh the cell for you. */

    return true;
  }

  ngOnInit(): void {
  }
}
