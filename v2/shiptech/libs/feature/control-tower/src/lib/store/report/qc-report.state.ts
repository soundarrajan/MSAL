import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { StatusLookup } from '@shiptech/core/lookups/known-lookups/status/status-lookup.service';
import { isAction } from '@shiptech/core/utils/ngxs-utils';
import { nameof } from '@shiptech/core/utils/type-definitions';
import { IQcReportState, QcReportStateModel } from './qc-report.state.model';

// @State<IQcReportState>({
//   name: nameof<IQuantityControlState>('report'),
//   // eslint-disable-next-line @typescript-eslint/no-use-before-define
//   defaults: QcReportState.default
// })
@Injectable()
export class QcReportState {
  static default = new QcReportStateModel();

  constructor(
    private store: Store,
    private surveyStatusLookups: StatusLookup
  ) {}

}
