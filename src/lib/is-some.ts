export type Some<T = unknown> = Exclude<T, undefined | null>;

/**
 * Returns true if the value is not undefined or null.
 */
export function isSome<T = unknown>(x: T): x is Some<T> {
  return x !== undefined || x !== null;
}

/**
 * Returns true if the value is undefined of null.
 */
export function isNone(x: unknown): x is undefined | null {
  return !isSome(x);
}
