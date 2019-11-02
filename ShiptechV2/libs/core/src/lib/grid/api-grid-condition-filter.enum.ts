export enum ApiGridConditionFilterEnum {
  isBlank = 'IS BLANK',
  isNotBlank = 'IS NOT NULL',
  contains = 'LIKE',
  notContains = 'NOT LIKE',
  equals = '=',
  notEqual = '!=',
  startsWith = 'LIKE1',
  endsWith = 'LIKE2',
  greaterThan = '>',
  greaterThanOrEqual = '>=',
  lessThan = '<',
  lessThanOrEqual = '<=',
  inRange = 'between'
}
