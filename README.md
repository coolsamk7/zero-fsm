# zero-fsm

**zero-fsm** is a **zero-boilerplate, fully typed, generic state machine library** for TypeScript. It supports **multiple named FSM instances**, **async hooks**, and utility methods to build scalable workflows and state-driven applications.

---

## Features

- Fully **generic** and **type-safe**
- Manage **multiple named state machines** with `StateMachineManager`
- **Async lifecycle hooks** (`onEnter`, `onExit`)
- Track **previous** and **current** states
- Utilities: `availableEvents()`, `reset()`, `is()`
- Minimal boilerplate, ideal for **frontend, backend, or workflow engines**

---

## Basic Usage

### Single StateMachine

```ts
import { createStateMachine } from "zero-fsm";

// Using helper function for automatic type inference
const fsm = createStateMachine({
  initial: "idle",
  states: {
    idle: { on: { START: "running" } },
    running: { on: { STOP: "idle" } },
  },
});

await fsm.send("START"); // transitions to "running"
console.log(fsm.current); // "running"
console.log(fsm.previous); // "idle"

console.log(fsm.availableEvents()); // ["STOP"]
fsm.reset();
console.log(fsm.current); // "idle"
```

### Multiple Named StateMachines

```ts
import { StateMachineManager, createStateMachine } from "zero-fsm";

const manager = new StateMachineManager();

// Auth FSM
manager.create("auth", createStateMachine({
  initial: "loggedOut",
  states: {
    loggedOut: { on: { LOGIN: "loggedIn" } },
    loggedIn: { on: { LOGOUT: "loggedOut" } },
  },
}));

// Player FSM
manager.create("player", createStateMachine({
  initial: "stopped",
  states: {
    stopped: { on: { PLAY: "playing" } },
    playing: { on: { PAUSE: "paused", STOP: "stopped" } },
    paused: { on: { PLAY: "playing", STOP: "stopped" } },
  },
}));

const authFsm = manager.get("auth");
await authFsm.send("LOGIN");
console.log(authFsm.current); // "loggedIn"

const playerFsm = manager.get("player");
await playerFsm.send("PLAY");
console.log(playerFsm.current); // "playing"

// Reset all FSMs
manager.resetAll();
console.log(authFsm.current); // "loggedOut"
console.log(playerFsm.current); // "stopped"

```
# StateMachine<TStates, TEvents> API Reference

A single finite state machine (FSM) instance with **type-safe states and events**.

---

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `current` | `TStates` | The **current state** of the FSM. |
| `previous?` | `TStates` | The **previous state** of the FSM. Initially `undefined`. |

---

## Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `send` | `(event: TEvents) => Promise<void>` | Trigger a **state transition** using the specified event. Throws an error if the transition is invalid. |
| `is` | `(state: TStates) => boolean` | Returns `true` if the FSM is currently in the specified state. |
| `availableEvents` | `() => TEvents[]` | Returns a **list of events** that can trigger a transition from the current state. |
| `reset` | `() => void` | Resets the FSM back to its **initial state**. |

---

## Example Usage

```ts
type States = "idle" | "loading" | "success" | "error";
type Events = "fetch" | "resolve" | "reject";

const fsm = new StateMachine<States, Events>({
  initial: "idle",
  transitions: {
    idle: { fetch: "loading" },
    loading: { resolve: "success", reject: "error" },
    success: { fetch: "loading" },
    error: { fetch: "loading" }
  }
});

await fsm.send("fetch"); // current = "loading"
console.log(fsm.is("loading")); // true
console.log(fsm.availableEvents()); // ["resolve", "reject"]
fsm.reset(); // current = "idle"
```
# StateMachineManager API Reference

Manages **multiple named FSM instances**.

---

## Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `create` | `(name: string, fsm: StateMachine<any, any>) => void` | Create and **register a named FSM instance**. |
| `get` | `(name: string) => StateMachine<any, any>` | Retrieve a **named FSM instance** for usage. |
| `resetAll` | `() => void` | Reset **all managed FSMs** to their initial states. |

---

## Example Usage

```ts
const fsm1 = new StateMachine({ initial: "idle", transitions: { idle: { fetch: "loading" } } });
const fsm2 = new StateMachine({ initial: "stopped", transitions: { stopped: { start: "running" } } });

const manager = new StateMachineManager();
manager.create("loader", fsm1);
manager.create("runner", fsm2);

const loaderFSM = manager.get("loader");
await loaderFSM.send("fetch"); // loaderFSM.current = "loading"

manager.resetAll(); // Resets both loaderFSM and runnerFSM to their initial states
```
# Real-World Examples

## Login Workflow

This example demonstrates how a **login process** can be modeled using a finite state machine (FSM).

```ts
const loginFsm = createStateMachine({
  initial: "idle",
  states: {
    idle: { on: { START_LOGIN: "loading" } },
    loading: { on: { SUCCESS: "loggedIn", FAILURE: "error" } },
    loggedIn: {},
    error: { on: { RETRY: "loading" } },
  },
});

// Usage example
await loginFsm.send("START_LOGIN"); // current = "loading"
await loginFsm.send("SUCCESS");     // current = "loggedIn"
console.log(loginFsm.is("loggedIn")); // true

// Handling errors
await loginFsm.send("FAILURE");     // current = "error"
await loginFsm.send("RETRY");       // current = "loading"
```
# Why zero-fsm?

**zero-fsm** is a minimal yet powerful finite state machine library for TypeScript.

- **Minimal setup** – Just define your states and transitions.
- **Full TypeScript support** – Type-safe states and events out of the box.
- **Multiple FSM management** – Manage multiple FSM instances with `StateMachineManager`.
- **Async-ready lifecycle hooks** – Perfect for complex workflows.
- **Versatile use cases** – Ideal for UI states, game logic, workflow engines, or server-side state management.

---

# Contributing

We welcome contributions!

1. **Fork the repository**
2. **Run tests**:
```bash
npx vitest run
```
