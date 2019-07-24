
export type MethodDecoratorFactory = (target: any, methodName: string, descriptor: PropertyDescriptor) => PropertyDescriptor;

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Used only to have compile type support column prop names, and tooling refactor.rename.
 * @param name TypeName from which to check the property name
 */
export const nameof = <T>(name: keyof T): keyof T => name;

/**
 * Type to define properties of another object as literal types 'isNew'
 */
export type ObjectProps<T> = { [P in keyof T]: P };

export enum LogicalOperator {
  And = 'And',
  Or = 'Or'
}
