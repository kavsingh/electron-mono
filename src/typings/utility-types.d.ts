// https://github.com/microsoft/TypeScript/issues/13923#issuecomment-653675557
// prettier-ignore
declare type Immutable<T> =
  // eslint-disable-next-line @typescript-eslint/ban-types
  T extends Function | boolean | number | string | null | undefined ? T :
  T extends Map<infer K, infer V> ? ReadonlyMap<Immutable<K>, Immutable<V>> :
  T extends Set<infer S> ? ReadonlySet<Immutable<S>> :
  {readonly [P in keyof T]: Immutable<T[P]>}

// https://stackoverflow.com/a/49889856
type UnwrapPromiseLike<T> = T extends PromiseLike<infer U> ? U : T;

type UnwrapArrayLike<T> = T extends ArrayLike<infer U> ? U : T;

type AsyncResult<T> = Immutable<UnwrapPromiseLike<ReturnType<T>>>;
