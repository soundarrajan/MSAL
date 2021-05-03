import { Inject, Injectable, OnDestroy } from '@angular/core';
import { QUANTITY_CONTROL_API_SERVICE } from './api/quantity-control-api';
import { IQuantityControlApiService } from './api/quantity-control.api.service.interface';
import { defer, Observable, of, throwError } from 'rxjs';
import { ModuleError } from '../core/error-handling/module-error';
import { BaseStoreService } from '@shiptech/core/services/base-store.service';
import { ModuleLoggerFactory } from '../core/logging/module-logger-factory';
import { Store } from '@ngxs/store';
import {
  LoadReportDetailsAction,
  LoadReportDetailsFailedAction,
  LoadReportDetailsSuccessfulAction
} from '../store/report/qc-report-details.actions';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { IAppState } from '@shiptech/core/store/states/app.state.interface';
import { IQcReportDetailsState } from '../store/report/details/qc-report-details.model';
import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';
import { IGetQcReportsListResponse } from './api/request-response/qc-reports-list.request-response';
import {
  IGetSoundingReportDetailsResponse,
  IGetSoundingReportListResponse
} from './api/request-response/sounding-reports.request-response';
import { UpdateProductTypeAction } from '../store/report/details/actions/update-product-type.actions';
import { QcProductTypeEditableProps } from '../views/delivery/details/components/port-call-grid/view-model/product-details.view-model';
import {
  UpdateActiveBunkerVesselResponseAction,
  UpdateActiveSludgeVesselResponseAction
} from '../store/report/details/actions/qc-vessel-response.actions';
import { UpdateQcReportComment } from '../store/report/details/actions/qc-comment.action';
import { IGetQcSurveyHistoryListResponse } from './api/request-response/qc-survey-history-list.request-response';
import {
  QcAddEventLogAction,
  QcLoadEventsLogAction,
  QcLoadEventsLogFailedAction,
  QcLoadEventsLogSuccessfulAction,
  QcRemoveEventLogAction,
  QcUpdateEventLogAction
} from '../store/report/details/actions/qc-events-log.action';
import { IGetOrderProductsListResponse } from './api/request-response/claims-list.request-response';
import {
  QcSaveReportDetailsAction,
  QcSaveReportDetailsFailedAction,
  QcSaveReportDetailsSuccessfulAction
} from '../store/report/details/actions/save-report.actions';
import { UrlService } from '@shiptech/core/services/url/url.service';
import { Router } from '@angular/router';
import {
  QcVerifyReportAction,
  QcVerifyReportFailedAction,
  QcVerifyReportSuccessfulAction
} from '../store/report/details/actions/verify-report.actions';
import {
  LoadReportListAction,
  LoadReportListFailedAction,
  LoadReportListSuccessfulAction
} from '../store/reports-list/qc-report-list.actions';
import {
  LoadReportSurveyHistoryAction,
  LoadReportSurveyHistoryFailedAction,
  LoadReportSurveyHistorySuccessfulAction
} from '../store/report/qc-report-survey-history.actions';
import {
  QcVesselResponseBunkerStateModel,
  QcVesselResponseSludgeStateModel
} from '../store/report/details/qc-vessel-responses.state';
import { values } from 'lodash';
import { IQcEventLogDeletedListItemDto } from './api/dto/qc-event-log-list-item.dto';
import {
  QcRevertVerifyReportAction,
  QcRevertVerifyReportFailedAction,
  QcRevertVerifyReportSuccessfulAction
} from '../store/report/details/actions/revert-verify-report.actions';
import { IQcReportState } from '../store/report/qc-report.state.model';
import { IVesselToWatchLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import {
  UpdateQcReportPortCall,
  UpdateQcReportVessel
} from '../store/report/details/actions/qc-vessel.action';
import { EMPTY$ } from '@shiptech/core/utils/rxjs-operators';
import { IQcVesselPortCallDto } from './api/dto/qc-vessel-port-call.interface';
import { map } from 'rxjs/operators';

@Injectable()


export class NotesService  {
  objNotes:any = [];
  constructor() {  }

}
