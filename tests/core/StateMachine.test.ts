import { describe, it, expect, vi } from "vitest";
import { StateMachine } from "@app/core";

describe("StateMachine", () => {
  it("should initialize with the given initial state", () => {
    const fsm = new StateMachine({
      initial: "idle",
      states: {
        idle: { on: { START: "running" } },
        running: { on: { STOP: "idle" } },
      },
    });

    expect(fsm.state).toBe("idle");
  });

  it("should transition to the next valid state", () => {
    const fsm = new StateMachine({
      initial: "idle",
      states: {
        idle: { on: { START: "running" } },
        running: { on: { STOP: "idle" } },
      },
    });

    fsm.send("START");
    expect(fsm.state).toBe("running");

    fsm.send("STOP");
    expect(fsm.state).toBe("idle");
  });

  it("should throw error on invalid transition", () => {
    const fsm = new StateMachine({
      initial: "idle",
      states: {
        idle: { on: { START: "running" } },
        running: { on: { STOP: "idle" } },
      },
    });

    expect(() => fsm.send("STOP")).toThrowError("Invalid transition");
  });

  it("should call onEnter callback when entering a state", () => {
    const onEnterRunning = vi.fn();
    const fsm = new StateMachine({
      initial: "idle",
      states: {
        idle: { on: { START: "running" } },
        running: {
          on: { STOP: "idle" },
          onEnter: onEnterRunning,
        },
      },
    });

    fsm.send("START");
    expect(onEnterRunning).toHaveBeenCalled();
  });

  it("should call onExit callback when leaving a state", () => {
    const onExitIdle = vi.fn();
    const fsm = new StateMachine({
      initial: "idle",
      states: {
        idle: {
          on: { START: "running" },
          onExit: onExitIdle,
        },
        running: { on: { STOP: "idle" } },
      },
    });

    fsm.send("START");
    expect(onExitIdle).toHaveBeenCalled();
  });

  it("should support async onEnter callback", async () => {
    const asyncEnter = vi.fn(async () => {
      return new Promise((resolve) => setTimeout(resolve, 10));
    });

    const fsm = new StateMachine({
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
