import { IMethodApiCallSettings } from '@shiptech/core/utils/decorators/api-call.decorator';

export interface IApiServiceSettings {
  id: string;
  selectedMethodName: string;
  methodSettings: IMethodApiCallSettings[];
}
