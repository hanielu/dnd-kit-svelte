export type Getter<T> = () => T;
export type MaybeGetter<T> = T | Getter<T>;

export type Expand<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;
