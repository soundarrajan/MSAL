
export interface IGetForTransactionForSearchRequest {
  Payload: {};
  UIFilters: {
    RequestStatuses: string;
  };
}

export interface IGetForTransactionForSearchResponse {
  id: number;
  name: string;
}
