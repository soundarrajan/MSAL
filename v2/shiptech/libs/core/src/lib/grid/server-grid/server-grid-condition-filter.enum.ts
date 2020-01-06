import { AgGridConditionTypeEnum } from '@shiptech/core/ui/components/ag-grid/type.definition';

export enum ServerGridConditionFilterEnum {
  NULL = 'IS NULL',
  NOT_NULL = 'IS NOT NULL',
  EQUALS = '=',
  NOT_EQUAL = '!=',
  LESS_THAN = '<',
  LESS_THAN_OR_EQUAL = '<=',
  GREATER_THAN = '>',
  GREATER_THAN_OR_EQUAL = '>=',
  IN_RANGE = 'BETWEEN',
  CONTAINS = 'LIKE',
  NOT_CONTAINS = 'NOT LIKE',
  STARTS_WITH = 'LIKE1',
  ENDS_WITH = 'LIKE2',
}

export const AgGridConditionTypeToServer: Record<AgGridConditionTypeEnum, ServerGridConditionFilterEnum> =
  {
    [AgGridConditionTypeEnum.YES]: ServerGridConditionFilterEnum.EQUALS,
    [AgGridConditionTypeEnum.NO]: ServerGridConditionFilterEnum.EQUALS,
    [AgGridConditionTypeEnum.NULL]: ServerGridConditionFilterEnum.NULL,
    [AgGridConditionTypeEnum.NOT_NULL]: ServerGridConditionFilterEnum.NOT_NULL,
    [AgGridConditionTypeEnum.EQUALS]: ServerGridConditionFilterEnum.EQUALS,
    [AgGridConditionTypeEnum.NOT_EQUAL]: ServerGridConditionFilterEnum.NOT_EQUAL,
    [AgGridConditionTypeEnum.LESS_THAN]: ServerGridConditionFilterEnum.LESS_THAN,
    [AgGridConditionTypeEnum.LESS_THAN_OR_EQUAL]: ServerGridConditionFilterEnum.LESS_THAN_OR_EQUAL,
    [AgGridConditionTypeEnum.GREATER_THAN]: ServerGridConditionFilterEnum.GREATER_THAN,
    [AgGridConditionTypeEnum.GREATER_THAN_OR_EQUAL]: ServerGridConditionFilterEnum.GREATER_THAN_OR_EQUAL,
    [AgGridConditionTypeEnum.IN_RANGE]: ServerGridConditionFilterEnum.IN_RANGE,
    [AgGridConditionTypeEnum.CONTAINS]: ServerGridConditionFilterEnum.CONTAINS,
    [AgGridConditionTypeEnum.NOT_CONTAINS]: ServerGridConditionFilterEnum.NOT_CONTAINS,
    [AgGridConditionTypeEnum.STARTS_WITH]: ServerGridConditionFilterEnum.STARTS_WITH,
    [AgGridConditionTypeEnum.ENDS_WITH]: ServerGridConditionFilterEnum.ENDS_WITH
  };

export enum ShiptechGridFilterOperators {
  AND = 1,
  OR = 2
}

