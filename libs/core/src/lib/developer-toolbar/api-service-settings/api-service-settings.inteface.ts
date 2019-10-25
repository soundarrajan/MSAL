import { IMethodApiCallSettings } from '@shiptech/core';

export interface IApiServiceSettings {
  id: string;
  selectedMethodName: string;
  methodSettings: IMethodApiCallSettings[];
}
