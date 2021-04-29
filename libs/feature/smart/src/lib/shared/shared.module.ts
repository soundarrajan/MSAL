import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../material-module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OlMapComponent } from './ol-map/ol-map.component';
import { LocalService } from '../services/local-service.service';
import { LoggerService } from '../services/logger.service';
import { HeaderComponent } from './header/header.component';
import { FilterchipsComponent } from './filterchips/filterchips.component';
import { MapPanelComponent } from './map-panel/map-panel.component';
import { SmartOperatorComponent } from './smart-operator/smart-operator.component';
import { VesselDetailsComponent } from './vessel-details/vessel-details.component';
import { AgGridModule } from '@ag-grid-community/angular';
import { AGGridCellRendererComponent } from './ag-grid/ag-grid-cell-renderer.component';
import { AGGridCellDataComponent ,HoverMenuComponent} from './ag-grid/ag-grid-celldata.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VesselInfoComponent } from './vessel-info/vessel-info.component';
import { AuditLogComponent } from './audit-log/audit-log.component';
import { RequestsDetailsComponent } from './requests-details/requests-details.component';
import { CommentsComponent } from './comments/comments.component';
import { NewRequestComponent } from './new-request/new-request.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { CurrentBunkeringPlanComponent } from './current-bunkering-plan/current-bunkering-plan.component';
import { PreviousBunkeringPlanComponent } from './previous-bunkering-plan/previous-bunkering-plan.component';
import { HeaderPanelComponent } from './header-panel/header-panel.component';
import { VesselPopupComponent, VesselMenuComponent } from './vessel-popup/vessel-popup.component';
import { PortPopupComponent, PortMenuComponent } from './port-popup/port-popup.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ConfirmationPopupComponent } from './confirmation-popup/confirmation-popup.component';
import { TableLegendComponent } from './table-legend/table-legend.component';
import { CustomStepperComponent } from './custom-stepper/custom-stepper.component';
import { SmartMessengerComponent } from './smart-messenger/smart-messenger.component';
import { SearchVesselComponent } from './search-vessel/search-vessel.component';
import { BunkeringPlanComponent } from './bunkering-plan/bunkering-plan.component';
import { BunkerPlanComponent } from './bunker-plan/bunker-plan.component';
import { FilterPipe } from './bunkering-plan/bunkering-plan.component';
import { WarningComponent } from './warning/warning.component';
import { VesselArrivalsComponent } from './vessel-arrivals/vessel-arrivals.component';
import { PortInfoComponent } from './port-info/port-info.component';
import { AuthGaurdService } from '../services/auth-guard.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { DatePickerFromToComponent } from './date-picker-from-to/date-picker-from-to.component';

@NgModule({
  declarations: [HeaderComponent, FilterchipsComponent, MapPanelComponent, SmartOperatorComponent, OlMapComponent, VesselDetailsComponent, HeaderPanelComponent,
    AGGridCellRendererComponent, AGGridCellDataComponent, VesselInfoComponent, AuditLogComponent, RequestsDetailsComponent, CommentsComponent, NewRequestComponent,
    CurrentBunkeringPlanComponent, PreviousBunkeringPlanComponent, HeaderPanelComponent, VesselPopupComponent, PortPopupComponent, NotificationsComponent, ConfirmationPopupComponent,
    TableLegendComponent, CustomStepperComponent, SmartMessengerComponent, SearchVesselComponent, BunkeringPlanComponent, BunkerPlanComponent, FilterPipe, WarningComponent,
    PortMenuComponent, VesselMenuComponent, VesselArrivalsComponent, PortInfoComponent, HoverMenuComponent, ConfirmDialogComponent, DatePickerFromToComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    DragDropModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    OwlDateTimeModule, OwlNativeDateTimeModule,
    MatDatepickerModule,
    AgGridModule.withComponents([AGGridCellRendererComponent, AGGridCellDataComponent])
  ],
  exports: [ReactiveFormsModule, FormsModule, FilterchipsComponent, MapPanelComponent, SmartOperatorComponent, OlMapComponent, HeaderPanelComponent,
    VesselInfoComponent, AuditLogComponent, RequestsDetailsComponent, CommentsComponent, NewRequestComponent, CurrentBunkeringPlanComponent,
    PreviousBunkeringPlanComponent, VesselPopupComponent, PortPopupComponent, NotificationsComponent, ConfirmationPopupComponent, TableLegendComponent,
    CustomStepperComponent, SmartMessengerComponent, SearchVesselComponent, BunkeringPlanComponent, BunkerPlanComponent, FilterPipe, WarningComponent,
    PortMenuComponent, VesselMenuComponent, PortInfoComponent, VesselArrivalsComponent, HoverMenuComponent, ConfirmDialogComponent],
  providers: [LocalService, LoggerService, AuthGaurdService],
  entryComponents: [VesselDetailsComponent, ConfirmationPopupComponent, WarningComponent, ConfirmDialogComponent]
})
export class SharedModule { }
