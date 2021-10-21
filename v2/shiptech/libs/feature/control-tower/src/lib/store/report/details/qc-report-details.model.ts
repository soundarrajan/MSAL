

import { IStatusLookupDto } from '@shiptech/core/lookups/known-lookups/status/status-lookup.interface';
import _ from 'lodash';

export class QcReportDetailsModel {
  isNew: boolean;
  id: number;
 
}

export interface IQcReportDetailsState extends QcReportDetailsModel {}
