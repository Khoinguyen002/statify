type AtomState = Readonly<{ [x: string]: any }>;

type AtomEventParams<K, P, N> = Readonly<{
  key: K;
  path: P;
  newValue: N;
}>;

type NestedKeyOf<T> = T extends (infer U)[]
  ? `${number}` | `${number}.${NestedKeyOf<U>}` // Handle array indexing
  : T extends Function
  ? never // Exclude functions
  : T extends object
  ? {
      [K in keyof T]-?: K extends string
        ? T[K] extends object | null | undefined
          ? `${K}` | `${K}.${NestedKeyOf<NonNullable<T[K]>>}` // Handle nested keys
          : `${K}`
        : never;
    }[keyof T]
  : never;

type PathValue<T, P extends string> = T extends object
  ? P extends `${infer Key}.${infer Rest}`
    ? Key extends keyof T
      ? T[Key] extends null | undefined
        ? null | undefined
        : Rest extends string
        ? PathValue<NonNullable<T[Key]>, Rest>
        : never
      : never
    : P extends keyof T
    ? T[P]
    : never
  : never;

interface PublicAtom<K extends string, V extends AtomState> {
  getKey(): K;
  get<P extends NestedKeyOf<V>>(path: P): PathValue<V, P>;
  getValues(): V;
  getCloneDeep<P extends NestedKeyOf<V>>(path: P): PathValue<V, P>;
  set<P extends NestedKeyOf<V>, N extends PathValue<V, P>>(
    path: P,
    newValue: N | ((state: Readonly<N>) => N)
  ): void;
  reset(newValue: Partial<V>): void;
}

export type { AtomEventParams, AtomState, NestedKeyOf, PathValue, PublicAtom };
