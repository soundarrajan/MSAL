import {IAuditLogItemDto} from '@shiptech/core/services/admin-api/request-response-dtos/audit-log.dto';
import {range} from 'lodash';
import { Chance } from 'chance';

const chance = new Chance();

export function getMockAuditLog(n: number): IAuditLogItemDto[] {
  return range(1, n).map(id => getMockAuditLogItem(id));
}

export function getMockAuditLogItem(id: number): IAuditLogItemDto {
  return {
    id,
    businessId: chance.d100(),
    date: chance.date().toISOString(),
    businessName: chance.string(),
    transactionType: chance.string(),
    fieldName: chance.string(),
    oldValue: chance.string(),
    newValue: chance.string(),
    oldNameValue: chance.string(),
    newNameValue: chance.string(),
    modifiedBy: {
      id: chance.d100(),
      name: chance.name(),
      displayName: chance.name()
    },
    modulePathUrl: chance.string(),
    clientIpAddress: chance.ip(),
    userAction: chance.string()
  };
}
