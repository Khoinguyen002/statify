# ReactJS Statify

Statify is a simple and lightweight global state management solution for React.js applications. It leverages the concept of atoms to manage state in a modular and type-safe manner.

## Features

- **Global State Management**: Easily manage and access state across your entire React application.
- **TypeScript Support**: Strongly typed with TypeScript for better developer experience.
- **Event-Driven Updates**: Efficient state updates using event listeners.
- **Immutable State**: Ensures state immutability to prevent unintended side effects.
- **Lightweight**: Minimal setup with no boilerplate.

## Installation

```bash
npm install reactjs-statify
# or
yarn add reactjs-statify
```

## Getting Started

Here's an example of how to use `reactjs-statify` in your application:

### 1. Create Atom

Atoms are the building blocks of your application's state. Here's how to define an atom for a counter:

```typescript
import { createAtom } from 'reactjs-statify';

export const countAtom = createAtom<'count', { countValue: { value: number } }>(
  'count',
  { countValue: { value: 0 } }
);
```

---

### 2. Use Atom in Components

You can access and update the atom's state in your React components using `useAtomSelector` and `set` methods.

```tsx
import { countAtom } from './state-management/count';

export default function Hello({ name }: { name: string }) {
  const count = useAtomSelector({ atom: countAtom, props: 'countValue.value' });

  const handleOnIncrease = () => {
    countAtom.set('countValue.value', (prev) => prev + 1);
  };

  const handleOnReset = () => {
    countAtom.set('countValue.value', 0);
  };

  return (
    <>
      <button onClick={handleOnIncrease}>{count}</button>
      <button onClick={handleOnReset}>RESET</button>
    </>
  );
}
```

---

### 3. Benefits of Using ReactJS Statify

- **Simple API**: Minimal learning curve for developers familiar with React.
- **Scalability**: Easily scale your state management as your application grows.
- **Integration**: Works seamlessly with existing React and TypeScript projects.

---

## API Reference

### `createAtom`

Creates an atom for managing a specific piece of state.

**Syntax**:
```typescript
createAtom<Name, State>(name: Name, initialState: State)
```

**Parameters**:
- `name`: A unique identifier for the atom.
- `initialState`: The initial state of the atom.

---

### `useAtomSelector`

Selects a specific part of an atom's state for use in a component.

**Syntax**:
```typescript
useAtomSelector({ atom, props })
```

**Parameters**:
- `atom`: The atom you want to access.
- `props`: The specific property or path in the atom's state you want to use.

---

### `atom.set`

Updates the state of an atom.

**Syntax**:
```typescript
atom.set(path, updater)
```

**Parameters**:
- `path`: The specific path in the state you want to update.
- `updater`: A new value or a function that returns the new value.

---

## License

ReactJS Statify is open-source and available under the MIT License.
