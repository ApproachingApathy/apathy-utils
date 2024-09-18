export type Some<T = unknown> = Exclude<T, undefined | null>;
export function isSome<T = unknown>(x: T): x is Some<T> {
  return x !== undefined || x !== null;
}

export function isNone(x: unknown): x is undefined | null {
  return !isSome(x);
}
