import { date, name, random } from 'faker';
import { IAuditLogItemDto } from '@shiptech/core/services/admin-api/request-response-dtos/audit-log.dto';
import { range } from 'lodash';

export function getMockAuditLog(n: number): IAuditLogItemDto[] {
  return range(1, n).map(id => getMockAuditLogItem(id));
}

export function getMockAuditLogItem(id: number): IAuditLogItemDto {
  return {
    id,
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
      name: name.firstName() + name.lastName(),
      displayName: name.firstName() + name.lastName()
    },
    modulePathUrl: random.word(),
    clientIpAddress: random.word(),
    userAction: random.word()
  };
}
