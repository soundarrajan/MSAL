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
import { AGGridDownloadFileComponent } from './ag-grid/ag-grid-download-file.component'
import { AGGridCellDataComponent ,HoverMenuComponent} from './ag-grid/ag-grid-celldata.component';
import { AgGridInputCellEditor} from './ag-grid/ag-grid-input-cell-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VesselInfoComponent } from './vessel-info/vessel-info.component';
import { AuditLogComponent } from './audit-log/audit-log.component';
import { RequestsDetailsComponent } from './requests-details/requests-details.component';
import { CommentsComponent } from './comments/comments.component';
import { NewRequestComponent } from './new-request/new-request.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
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
import { AllBunkeringPlanComponent } from './all-bunkering-plan/all-bunkering-plan.component';
import { FilterPipe } from "./pipes/filterPipe/filter.pipe";
import { WarningComponent } from './warning/warning.component';
import { VesselArrivalsComponent } from './vessel-arrivals/vessel-arrivals.component';
import { PortInfoComponent } from './port-info/port-info.component';
import { AuthGaurdService } from '../services/auth-guard.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { DatePickerFromToComponent } from './date-picker-from-to/date-picker-from-to.component';
import { NoDataComponent } from './no-data-popup/no-data-popup.component';
import { CommentDPFormatPipe } from './pipes/CommentDPPipe/comment-dpformat.pipe';
import { GroupByPipe } from './pipes/groupByPipe/group-by.pipe'
import { groupBy } from 'lodash';
import { FilterCommentByParticipantPipe } from './pipes/filterCommentPipe/filter-comment-by-participant.pipe';
import { GroupByParticipantPipe } from './pipes/groupByParticipantPipe/group-by-participant.pipe';
import { EnUsDatePipePipe } from './pipes/EnUsDatePipe/en-us-date-pipe.pipe';
import { WarningoperatorpopupComponent } from './warningoperatorpopup/warningoperatorpopup.component';
import { SuccesspopupComponent } from './successpopup/successpopup.component';
import { FutureRequestGridComponent } from './future-request-grid/future-request-grid.component';
import { CountByPriorityPipe } from './pipes/count-by-priority.pipe';
import { UtcDatePipePipe } from './pipes/UtcDatePipe/utc-date-pipe.pipe';

@NgModule({
  declarations: [HeaderComponent, FilterchipsComponent, MapPanelComponent, SmartOperatorComponent, OlMapComponent, VesselDetailsComponent, HeaderPanelComponent,
    AGGridCellRendererComponent, AGGridDownloadFileComponent, AGGridCellDataComponent, AgGridInputCellEditor, VesselInfoComponent, AuditLogComponent, RequestsDetailsComponent, CommentsComponent, NewRequestComponent,
    HeaderPanelComponent, VesselPopupComponent, PortPopupComponent, NotificationsComponent, ConfirmationPopupComponent,
    TableLegendComponent, CustomStepperComponent, SmartMessengerComponent, SearchVesselComponent, BunkeringPlanComponent, WarningComponent,
    PortMenuComponent, VesselMenuComponent, VesselArrivalsComponent, PortInfoComponent, HoverMenuComponent, ConfirmDialogComponent,
    DatePickerFromToComponent,
    FilterPipe, AllBunkeringPlanComponent,NoDataComponent, CommentDPFormatPipe, GroupByPipe, FilterCommentByParticipantPipe, GroupByParticipantPipe, EnUsDatePipePipe, WarningoperatorpopupComponent,
    SuccesspopupComponent,
    UtcDatePipePipe,
    FutureRequestGridComponent, 
    CountByPriorityPipe],
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
    AgGridModule.withComponents([AGGridCellRendererComponent,AGGridDownloadFileComponent, AGGridCellDataComponent, AgGridInputCellEditor])
  ],
  exports: [ReactiveFormsModule, FormsModule, FilterchipsComponent, MapPanelComponent, SmartOperatorComponent, OlMapComponent, HeaderPanelComponent,
    VesselInfoComponent, AuditLogComponent, RequestsDetailsComponent, CommentsComponent, NewRequestComponent, VesselPopupComponent, PortPopupComponent, NotificationsComponent, ConfirmationPopupComponent, TableLegendComponent,
    CustomStepperComponent, SmartMessengerComponent, SearchVesselComponent, BunkeringPlanComponent, WarningComponent,
    PortMenuComponent, VesselMenuComponent, PortInfoComponent, VesselArrivalsComponent, HoverMenuComponent, ConfirmDialogComponent,
    FilterPipe, CommentDPFormatPipe, GroupByPipe, FilterCommentByParticipantPipe, GroupByParticipantPipe, EnUsDatePipePipe, AllBunkeringPlanComponent,NoDataComponent, WarningoperatorpopupComponent, UtcDatePipePipe, CountByPriorityPipe, SuccesspopupComponent],
  providers: [LocalService, LoggerService, AuthGaurdService, BunkeringPlanComponent, FutureRequestGridComponent],
  entryComponents: [VesselDetailsComponent, ConfirmationPopupComponent, WarningComponent, ConfirmDialogComponent,NoDataComponent,WarningoperatorpopupComponent, SuccesspopupComponent]
})
export class SharedModule { }
