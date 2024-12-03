import { STATE_CHANGE_EVENT } from "./atom.constants";
import { event } from "./atom.events";
import { AtomState, NestedKeyOf, PathValue, PublicAtom } from "./atom.type";
import {
  assignNestedValue,
  cloneDeep,
  getNestedValue,
  isNewValueNotFunction,
} from "./atom.utils";

export class Atom<K extends string, V extends AtomState>
  implements PublicAtom<K, V>
{
  private key: K;
  private value: V;
  private defaultValue: V;
  private watchingPaths: Map<NestedKeyOf<V>, true>;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
    this.defaultValue = cloneDeep(value);
    this.watchingPaths = new Map();
  }

  public get<P extends NestedKeyOf<V>>(path: P) {
    return getNestedValue(path, this.value);
  }

  public getCloneDeep<P extends NestedKeyOf<V>>(path: P) {
    return cloneDeep(getNestedValue(path, this.value));
  }

  public getValues() {
    return this.value;
  }

  public getKey() {
    return this.key;
  }

  public set<P extends NestedKeyOf<V>, N extends PathValue<V, P>>(
    path: P,
    newValue: N | ((state: Readonly<N>) => N)
  ) {
    const { current, lastKey } = assignNestedValue(path, this.value);
    current[lastKey] = isNewValueNotFunction(newValue)
      ? newValue
      : newValue(current[lastKey]);
    this.watchingPaths.forEach((value, key) => {
      if (key.includes(path) || path.includes(key)) {
        const eventName = STATE_CHANGE_EVENT + "_" + this.key + "_" + key;
        event.dispatchEvent(new Event(eventName));
      }
    });
  }

  public reset(newValue: Partial<V>) {
    this.value =
      typeof newValue === "object"
        ? { ...cloneDeep(this.defaultValue), ...newValue }
        : newValue;
    this.watchingPaths.forEach((value, key) => {
      const eventName = STATE_CHANGE_EVENT + "_" + this.key + "_" + key;
      event.dispatchEvent(new Event(eventName));
    });
  }

  public addWatchingPaths(path: NestedKeyOf<V>) {
    this.watchingPaths.set(path, true);
  }

  public removeWatchingPaths(path: NestedKeyOf<V>) {
    this.watchingPaths.delete(path);
  }
}

const createAtom = function <K extends string, A extends AtomState>(
  key: K,
  value: A
): PublicAtom<K, A> {
  return new Atom(key, value);
};

export function toAtom<K extends string, V extends AtomState>(
  publicAtom: PublicAtom<K, V>
): Atom<K, V> {
  return publicAtom as Atom<K, V>;
}

export default createAtom;
