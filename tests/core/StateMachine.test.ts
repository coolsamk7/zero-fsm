import { describe, it, expect, vi } from "vitest";
import { StateMachine } from "@fsm/core";

type MyStates = "idle" | "running";
type MyEvents = "START" | "STOP";

describe("StateMachine", () => {
  it("should initialize with the given initial state", () => {
    const fsm = new StateMachine<MyStates, MyEvents>({
      initial: "idle",
      states: {
        idle: { on: { START: "running" } },
        running: { on: { STOP: "idle" } },
      },
    });

    expect(fsm.state).toBe("idle");
  });

  it("should transition to the next valid state", async () => {
    const fsm = new StateMachine<MyStates, MyEvents>({
      initial: "idle",
      states: {
        idle: { on: { START: "running" } },
        running: { on: { STOP: "idle" } },
      },
    });

    await fsm.send("START");
    expect(fsm.state).toBe("running");

    await fsm.send("STOP");
    expect(fsm.state).toBe("idle");
  });

  it("should throw error on invalid transition (sync)", () => {
    const fsm = new StateMachine<MyStates, MyEvents>({
      initial: "idle",
      states: {
        idle: { on: { START: "running" } },
        running: { on: { STOP: "idle" } },
      },
    });

    expect(() => fsm.send("STOP")).rejects.toThrowError(
      "Invalid transition from idle on STOP"
    );
  });

  it("should call onEnter callback when entering a state", async () => {
    const onEnterRunning = vi.fn();

    const fsm = new StateMachine<MyStates, MyEvents>({
      initial: "idle",
      states: {
        idle: { on: { START: "running" } },
        running: {
          on: { STOP: "idle" },
          onEnter: onEnterRunning,
        },
      },
    });

    await fsm.send("START");
    expect(onEnterRunning).toHaveBeenCalled();
  });

  it("should call onExit callback when leaving a state", async () => {
    const onExitIdle = vi.fn();

    const fsm = new StateMachine<MyStates, MyEvents>({
      initial: "idle",
      states: {
        idle: {
          on: { START: "running" },
          onExit: onExitIdle,
        },
        running: { on: { STOP: "idle" } },
      },
    });

    await fsm.send("START");
    expect(onExitIdle).toHaveBeenCalled();
  });

  it("should support async onEnter callback", async () => {
    const asyncEnter = vi.fn(async () => {
      return new Promise((resolve) => setTimeout(resolve, 10));
    });

    const fsm = new StateMachine<MyStates, MyEvents>({
      initial: "idle",
      states: {
        idle: { on: { START: "running" } },
        running: {
          on: { STOP: "idle" },
          onEnter: asyncEnter,
        },
      },
    });

    await fsm.send("START");
    expect(asyncEnter).toHaveBeenCalled();
  });
});
