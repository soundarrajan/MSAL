import * as faker from 'faker';
import {IQcReportDetailsAuditLogItemDto} from "../dto/qc-report-details-audit-log.dto";

export function getMockQcReportDetailsAuditLog(): IQcReportDetailsAuditLogItemDto {
  return {
    businessId: faker.random.number(100),
    date: faker.date.past().toISOString(),
    businessName: faker.random.word(),
    transactionType: faker.random.word(),
    fieldName: faker.random.word(),
    oldValue: faker.random.word(),
    newValue: faker.random.word(),
    oldNameValue: faker.random.word(),
    newNameValue: faker.random.word(),
    modifiedBy: {
      id: faker.random.number(100),
      name: faker.random.word(),
      displayName: faker.random.word()
    },
    totalCount: faker.random.number(100),
    id: faker.random.number(),
    isDeleted: faker.random.boolean(),
    modulePathUrl: faker.random.word(),
    clientIpAddress: faker.random.word(),
    userAction: faker.random.word()
  };
}
