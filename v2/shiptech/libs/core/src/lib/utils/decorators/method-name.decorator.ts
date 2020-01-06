import 'reflect-metadata';

export const METHOD_NAME_KEY = Symbol('methodNameParameter');

// noinspection JSUnusedGlobalSymbols
export function MethodName(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
  // save a reference to the original method this way we keep the values currently in the
  // descriptor and don't overwrite what another decorator might have done to the descriptor.
  if (descriptor === undefined) {
    descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
  }
  const originalMethod = descriptor.value;

  // Pull the signature's metadata
  const parameterMetadata: Array<number> = Reflect.getOwnMetadata(METHOD_NAME_KEY, target, propertyKey) || [];

  descriptor.value = function(): any {
    const args = Array.from(arguments);

    parameterMetadata.forEach(paramIndex => (args[paramIndex] = propertyKey));

    return originalMethod.apply(this, args);
  };

  // return edited descriptor as opposed to overwriting the descriptor
  return descriptor;
}

/**
 * Defines in which method parameter to inject the method name string
 * @param target
 * @param propertyKey
 * @param parameterIndex
 */
export function MethodNameParam(target: any, propertyKey: string | symbol, parameterIndex: number): void {
  // Pull existing parameters for this method or create an empty array
  const methodNameParams = Reflect.getOwnMetadata(METHOD_NAME_KEY, target, propertyKey) || [];
  // Add this parameter
  methodNameParams.push(parameterIndex);
  // Ensure regular order
  methodNameParams.sort();
  Reflect.defineMetadata(METHOD_NAME_KEY, methodNameParams, target, propertyKey);
}

/**
 * Sets the value of the property to be the name of the key
 * @param target
 * @param key
 */
export function PropName(target: any, key: string): void {
  Object.defineProperty(target, key, {
    configurable: false,
    get: () => key
  });
}
