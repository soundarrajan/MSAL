export function nullable<T>(obj: T): T {
  return obj || <T>{};
}
