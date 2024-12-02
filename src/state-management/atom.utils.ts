import { AtomState, NestedKeyOf, PathValue } from './atom.type';

const isNewValueNotFunction = <N>(newValue: N | ((state: N) => N)): newValue is N => {
  return typeof newValue !== 'function';
};

function getNestedValue<V extends AtomState, P extends NestedKeyOf<V>>(
  path: P,
  value: V,
): PathValue<V, P> {
  const keys = path.split('.') as (keyof any)[];
  let current = value as any;
  for (const key of keys) {
    current = current[key];
    if (current === undefined || current === null) break;
  }
  return current;
}

function assignNestedValue<V, P extends NestedKeyOf<V>>(
  path: P,
  value: V,
): { lastKey: keyof any; current: any } {
  let current = value as any;
  const keys = path.split('.') as Array<keyof any>;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key]) current[key] = {};
    current = current[key];
  }
  return { lastKey: keys[keys.length - 1], current };
}

function cloneDeep<T>(value: T, stack: Map<any, any> = new Map()): T {
  if (value === null || typeof value !== 'object') {
    return value; // Primitive values are returned as is
  }

  // Handle circular references
  if (stack.has(value)) {
    return stack.get(value);
  }

  let result: any;

  if (Array.isArray(value)) {
    result = [];
    stack.set(value, result);
    value.forEach((item, index) => {
      result[index] = cloneDeep(item, stack);
    });
  } else if (value instanceof Date) {
    result = new Date(value);
  } else if (value instanceof RegExp) {
    result = new RegExp(value.source, value.flags);
  } else if (value instanceof Map) {
    result = new Map();
    stack.set(value, result);
    value.forEach((v, k) => {
      result.set(k, cloneDeep(v, stack));
    });
  } else if (value instanceof Set) {
    result = new Set();
    stack.set(value, result);
    value.forEach((v) => {
      result.add(cloneDeep(v, stack));
    });
  } else if (
    value &&
    typeof value === 'object' &&
    'constructor' in value &&
    (value as Record<string, any>).constructor !== Object
  ) {
    throw new Error(`Unsupported object type: ${(value as Record<string, any>).constructor.name}`);
  } else {
    // Handle plain objects
    result = {} as T;
    stack.set(value, result);
    Object.keys(value).forEach((key) => {
      (result as any)[key] = cloneDeep((value as any)[key], stack);
    });
  }

  return result;
}

export { isNewValueNotFunction, getNestedValue, assignNestedValue, cloneDeep };
