import { QcReportsListItemModel } from '../../../services/models/qc-reports-list-item.model';
import { Injectable } from '@angular/core';
import { PropName } from '@shiptech/core/utils/decorators/method-name.decorator';

export interface IQcReportsListItemProps extends QcReportsListItemModel {
}

@Injectable({
  providedIn: 'root'
})
export class QcReportsListItemProps implements IQcReportsListItemProps {
  @PropName id;
  @PropName port;
  @PropName vesselName;
  @PropName surveyDate;
  @PropName surveyStatus;
  @PropName matchedQuantity;
  @PropName logBookRobBeforeDelivery;
  @PropName measuredRobBeforeDelivery;
  @PropName robBeforeDelivery;
  @PropName bdnQuantity;
  @PropName measuredDeliveredQuantity;
  @PropName deliveredQuantity;
  @PropName logBookRobAfterDelivery;
  @PropName measuredRobAfterDelivery;
  @PropName robAfterDelivery;
  @PropName logBookSludgeBeforeDischarge;
  @PropName measuredSludgeRobBeforeDischarge;
  @PropName sludgeDischargedQuantity;
  @PropName comment;
}

export enum QcReportsListColumns {
  callId = 'Call ID',
  port = 'Port call',
  vesselName = 'Vessel name',
  surveyDate = 'Survey date',
  surveyStatus = 'Survey status',
  matchedQuantity = 'Matched quantity',
  logBookRobBeforeDelivery = 'Log Book Rob Before',
  measuredRobBeforeDelivery = 'Measured Rob before',
  robBeforeDelivery = 'Rob Before Delivery',
  bdnQuantity = 'BDN',
  measuredDeliveredQuantity = 'Measured Delivered Quantity',
  deliveredQuantity = 'Delivered Quantity',
  logBookRobAfterDelivery = 'Log Book Rob After',
  measuredRobAfterDelivery = 'Measure Rob after',
  robAfterDelivery = 'Rob After Delivery',
  logBookSludgeBeforeDischarge = 'Log Book Sludge Before',
  measuredSludgeRobBeforeDischarge = 'Measured Sludge Rob',
  sludgeDischargedQuantity = 'Sludge Discharged Quantity',
  comment = 'Comment',
}

export enum QcReportsListColumnsLabels {
  callId = 'Call ID',
  port = 'Port call',
  vesselName = 'Vessel name',
  surveyDate = 'Survey date',
  surveyStatus = 'Survey status',
  matchedQuantity = 'Matched quantity',
  logBookRobBeforeDelivery = 'Log Book Rob Before',
  measuredRobBeforeDelivery = 'Measured Rob before',
  robBeforeDelivery = 'Rob Before Delivery',
  bdnQuantity = 'BDN',
  measuredDeliveredQuantity = 'Measured Delivered Quantity',
  deliveredQuantity = 'Delivered Quantity',
  logBookRobAfterDelivery = 'Log Book Rob After',
  measuredRobAfterDelivery = 'Measure Rob after',
  robAfterDelivery = 'Rob After Delivery',
  logBookSludgeBeforeDischarge = 'Log Book Sludge Before',
  measuredSludgeRobBeforeDischarge = 'Measured Sludge Rob',
  sludgeDischargedQuantity = 'Sludge Discharged Quantity',
  comment = 'Comment',
}
