import { Type } from '@angular/core';

export type MethodDecoratorFactory = (target: any, methodName: string, descriptor: PropertyDescriptor) => PropertyDescriptor;

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Used only to have compile type support column prop names, and tooling refactor.rename.
 * @param name TypeName from which to check the property name
 */
export function nameof<T = any>(name: Type<any>): string;
export function nameof<T = any>(name: keyof T): keyof T;
export function nameof<T>(name: any): string {
  // Note: For some reason typescript/angular does not process correctly literals like { [ClassName.name]: null }, but it works with { [ClassName.name.toString()]: null }
  if(typeof name === 'function') {
    return name.name.toString();
  }
  return name;
};

/**
 * Type to define properties of another object as literal types 'isNew'
 */
export type ObjectProps<T> = { [P in keyof T]: P };

export enum LogicalOperator {
  And = 'And',
  Or = 'Or'
}

export function getPathToModel<T = any, TProp1 extends keyof T = keyof T, TProp2 extends keyof T[TProp1] = keyof T[TProp1]>(prop1: TProp1, prop2: TProp2): string {
  return `${prop1}.${prop2}`;
}

export type TODO = unknown;

