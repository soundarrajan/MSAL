import { throwError } from 'rxjs';
import { MethodDecoratorFactory } from '../type-definitions';
import { environment } from '@shiptech/environment';

export function ObservableException<T = unknown>(overrideError?: T): MethodDecoratorFactory {
  return (target: any, methodName: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    const oldMethod = descriptor.value;

    descriptor.value = function(...args: any[]): any {
      try {
        return oldMethod.apply(this, args);
      } catch (err) {
        if (!environment.production) {
          // TODO: Add root logger here
          // RootLogger.warn(`Wrapped {MethodName}'s exception in Observable. Original Exception: {@Exception}`, methodName, err);
        }

        return throwError(overrideError || err);
      }
    };
    return descriptor;
  };
}
