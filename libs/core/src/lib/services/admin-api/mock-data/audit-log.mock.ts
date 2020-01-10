import {date, random} from 'faker';
import {IQcReportDetailsAuditLogItemDto} from "@shiptech/core/services/admin-api/dtos/audit-log.dto";
import {range} from "lodash";

export function getMockAuditLog(n: number): IQcReportDetailsAuditLogItemDto[] {
  return range(1, n).map(id => getMockAuditLogItem(id));
}

export function getMockAuditLogItem(id: number): IQcReportDetailsAuditLogItemDto {
  return {
    id: id,
    businessId: random.number(100),
    date: date.past().toISOString(),
    businessName: random.word(),
    transactionType: random.word(),
    fieldName: random.word(),
    oldValue: random.word(),
    newValue: random.word(),
    oldNameValue: random.word(),
    newNameValue: random.word(),
    modifiedBy: {
      id: random.number(100),
      name: random.word(),
      displayName: random.word()
    },
    totalCount: random.number(100),
    isDeleted: random.boolean(),
    modulePathUrl: random.word(),
    clientIpAddress: random.word(),
    userAction: random.word()
  };
}
