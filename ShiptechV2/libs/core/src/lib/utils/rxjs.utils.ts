import { Observable, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { _throw } from 'rxjs-compat/observable/throw';

export const retryStrategy = ({
                                maxRetryAttempts = 3,
                                scalingDuration = 1000,
                                excludedStatusCodes = []
                              }: {
  maxRetryAttempts?: number;
  scalingDuration?: number;
  excludedStatusCodes?: number[];
} = {}) => (attempts: Observable<any>) =>
  attempts.pipe(
    mergeMap((error, i) => {
      const retryAttempt = i + 1;
      // if maximum number of retries have been met
      // or response is a status code we don't wish to retry, throw error
      if (retryAttempt > maxRetryAttempts || excludedStatusCodes.find(e => e === error.status)) {
        return _throw(error);
      }
      // retry after 1s, 2s, etc...
      return timer(retryAttempt * scalingDuration);
    })
  );

export type Parameters<T> = T extends (...args: infer U) => any ? U : never;
