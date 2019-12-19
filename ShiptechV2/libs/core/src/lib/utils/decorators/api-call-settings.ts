import { Observable } from 'rxjs';

export const RANDOM_DELAY = -1;
export const defaultCannnedResponse: ICannedResponse = { name: 'Default', response: undefined };
const DefaultForwardToRead = true;

export class ApiCallSettings {
  delay = 0;
  delayMax = 300;
  delayMin = 50;
  throwError = false;
  cannedResponses: ICannedResponse[] = [];
  nextResponse = defaultCannnedResponse;
  forwardToReal = DefaultForwardToRead; // environment.production;
  apiUrl: string;

  constructor({ delay, delayMin, delayMax, throwError, cannedResponses, forwardToReal, apiUrl }: Partial<IApiCallSettings> = {}) {
    this.delay = delay || 0;
    this.delayMax = delayMax || 300;
    this.delayMin = delayMin || 50;
    this.throwError = throwError === undefined ? false : throwError;
    this.forwardToReal = forwardToReal !== undefined ? forwardToReal : DefaultForwardToRead;
    this.cannedResponses = cannedResponses ? [defaultCannnedResponse, ...cannedResponses] : [defaultCannnedResponse];
    this.apiUrl = apiUrl;
  }
}

export interface IApiCallSettings extends ApiCallSettings {}

export interface ICannedResponse<T = any> {
  name: string;
  response: Observable<T>;
}
