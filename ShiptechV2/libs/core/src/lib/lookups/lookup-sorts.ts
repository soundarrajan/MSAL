export interface ISortsInterface {
  ColumnValue: string;
  SortIndex: number;
  SortParameter: 'asc' | 'desc';
}

export class SortsDto implements ISortsInterface {
  constructor(public ColumnValue: string, public SortIndex: number, public SortParameter: 'asc' | 'desc') {}
}
