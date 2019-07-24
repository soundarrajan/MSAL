// TODO: Disabled no-console until we find a solution to replace mocked services at runtime. Until then, console.long will server as a reminder
/* tslint:disable:no-console */
import { ApiCallSettings, defaultCannnedResponse, IApiCallSettings, RANDOM_DELAY } from './api-call-settings';
import { isObservable, throwError, timer } from 'rxjs';
import { catchError, concatMap, first, mergeMap, tap } from 'rxjs/operators';
import getParamNames from '@captemulation/get-parameter-names';
import { getRandomInt } from '../math';
import { MethodDecoratorFactory } from '../type-definitions';
import { ApiError } from '../../error-handling/api/api-error';
import { environment } from '@techoil/environment';

export const API_CALL_KEY = Symbol('_$apiCallMethod$');
export const API_CALL_FORWARD_TO = Symbol('_$apiCallForwardTo$');
export const API_CALL_URL = Symbol('_$apiCallurl$');

export interface IMethodApiCallSettings {
  name: string;
  settings: Partial<IApiCallSettings>;
}

export function getApiCallForwardToValue(target: any): any {
  const forwardToProps = Object.keys(target)
    .map(key => <string>Reflect.getMetadata(API_CALL_FORWARD_TO, target, key))
    .filter(m => m);

  if (!forwardToProps || forwardToProps.length === 0) {
    return undefined;
  }

  const mockServiceForwardToProp = forwardToProps[0];

  return target[mockServiceForwardToProp];
}

export function getApiCallUrlKey(target: any): string {
  const apiUrlProps = Object.keys(target)
    .map(key => <string>Reflect.getMetadata(API_CALL_URL, target, key))
    .filter(m => m);

  if (!apiUrlProps || apiUrlProps.length === 0) {
    return undefined;
  }

  return apiUrlProps[0];
}

export function getApiCallUrlValue(target: any, targetIsMock: boolean = true): any {
  const realService = targetIsMock ? getApiCallForwardToValue(target) : target;
  if (!realService) {
    return undefined;
  }
  const apiUrlProperty = getApiCallUrlKey(realService);

  return realService[apiUrlProperty];
}

function getForwardMethod(mockService: any, methodName: string): Function {
  const realService = getApiCallForwardToValue(mockService);

  if (!realService) {
    return undefined;
  }
  const realServiceMethod = <Function>realService[methodName];
  if (!realServiceMethod) {
    return undefined;
  }

  return realServiceMethod.bind(realService);
}

export function ApiCall(settings: Partial<IApiCallSettings> = {}): MethodDecoratorFactory {
  settings = { ...new ApiCallSettings(), ...settings };

  const setApiUrl = function(target: any): () => void {
    if (settings.forwardToReal && settings.apiUrl) {
      const realService = getApiCallForwardToValue(target);

      if (realService) {
        const apiUrlProperty = getApiCallUrlKey(realService);

        if (apiUrlProperty) {
          const beforeApiUrl = realService[apiUrlProperty];
          realService[apiUrlProperty] = settings.apiUrl;

          // Note: Restore url, if ever needed.
          return () => {
            realService[apiUrlProperty] = beforeApiUrl;
          };
        }
      }
    }
    return () => {}; // no-op
  };

  return (target: any, methodName: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    if (environment.production) {
      return descriptor;
    }
    // the descriptor holds a reference to the actual method we are decorating
    const originalMethod = descriptor.value;

    const methodSettings: IMethodApiCallSettings = { name: methodName, settings };
    Reflect.defineMetadata(API_CALL_KEY, methodSettings, target, methodName);

    // we replace the old function with a new function
    descriptor.value = function(...args: any[]): any {
      // call the original method and augment the resulting observable with the delay and log

      const callDelay = settings.delay === RANDOM_DELAY ? getRandomInt(settings.delayMin, settings.delayMax) : settings.delay;
      const callToMethod = settings.forwardToReal ? getForwardMethod(this, methodName) || originalMethod : originalMethod;
      const isMocked = callToMethod === originalMethod;

      logMethodCall(methodName, arguments, originalMethod, callDelay, isMocked);

      if (settings.throwError) {
        return timer(callDelay).pipe(
          first(),
          tap(() => logMethodReturn(methodName, ApiError.MockError, isMocked)),
          mergeMap(() => throwError(ApiError.MockError))
        );
      }

      setApiUrl(this);

      const originalResponse = callToMethod.apply(this, args);

      if (!isObservable(originalResponse)) {
        console.warn(`Response of API call: ${methodName} was not an Observable. Response will not be delayed. Actual response: %o`, originalResponse);
        return originalResponse;
      }

      const response$ = settings.nextResponse === defaultCannnedResponse ? originalResponse : settings.nextResponse.response;
      const catchErrors$ = catchError(err => {
        logMethodReturnError(methodName, err, isMocked);
        return throwError(err);
      });
      const logResponse$ = tap(result => logMethodReturn(methodName, result, isMocked));

      if (callDelay === 0) {
        return response$.pipe(
          catchErrors$,
          logResponse$
        );
      } else {
        return timer(callDelay).pipe(
          first(),
          concatMap(() => response$),
          catchErrors$,
          logResponse$
        );
      }
    };
    // return edited descriptor as opposed to overwriting the descriptor
    return descriptor;
  };
}

function logMethodCall(methodName: string, methodArgs: Iterable<any>, originalMethod: Function, responseDelay: number, isMocked: boolean): void {
  const argNames = getParamNames(originalMethod);

  console.groupCollapsed(`%c${isMocked ? 'Mock' : 'Real'} Request: ${methodName}`, 'color: blue;');

  Array.from(methodArgs).forEach((arg: any, index: number) => console.log(`%c${argNames[index]}: %o`, 'color: black; font-weight: bold;', arg));
  console.log('Delay: %o ms', responseDelay);

  console.groupEnd();
}

function logMethodReturn(methodName: string, returnValue: any, isMocked: boolean): void {
  console.groupCollapsed(`%c${isMocked ? 'Mock' : 'Real'} Response: ${methodName}`, 'color: green;');
  console.log(returnValue);
  console.groupEnd();
}

function logMethodReturnError(methodName: string, err: any, isMocked: boolean): void {
  console.groupCollapsed(`%c${isMocked ? 'Mock' : 'Real'} Response: ${methodName}`, 'color: ref;');
  console.error('Error: %o', err);
  console.groupEnd();
}

export function ApiCallForwardTo(): Function {
  return (target: any, key: string): void => {
    if (environment.production) {
      return;
    }
    Reflect.defineMetadata(API_CALL_FORWARD_TO, key, target, key);
  };
}

export function ApiCallUrl(): Function {
  return (target: any, key: string): void => {
    if (environment.production) {
      return;
    }
    Reflect.defineMetadata(API_CALL_URL, key, target, key);
  };
}
