import { describe, it, expect, beforeEach, vi } from "vitest";
import { StateMachine } from "@fsm/core";

describe("StateMachine", () => {
  let fsm: StateMachine<"idle" | "running", "START" | "STOP">;
  let onEnterIdle: ReturnType<typeof vi.fn>;
  let onExitIdle: ReturnType<typeof vi.fn>;
  let onEnterRunning: ReturnType<typeof vi.fn>;
  let onExitRunning: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onEnterIdle = vi.fn();
    onExitIdle = vi.fn();
    onEnterRunning = vi.fn();
    onExitRunning = vi.fn();

    fsm = new StateMachine({
      initial: "idle",
      states: {
        idle: { on: { START: "running" }, onEnter: onEnterIdle, onExit: onExitIdle },
        running: { on: { STOP: "idle" }, onEnter: onEnterRunning, onExit: onExitRunning },
      },
    });
  });

  it("should start with initial state", () => {
    expect(fsm.current).toBe("idle");
    expect(fsm.previous).toBeUndefined();
  });

  it("should transition on valid event", async () => {
    await fsm.send("START");
    expect(fsm.current).toBe("running");
    expect(fsm.previous).toBe("idle");
  });

  it("should throw on invalid transition", async () => {
    await expect(fsm.send("STOP" as any)).rejects.toThrow(
      'Invalid transition from "idle" with "STOP"'
    );
  });

  it("should track previous state", async () => {
    await fsm.send("START");
    expect(fsm.previous).toBe("idle");
    await fsm.send("STOP");
    expect(fsm.previous).toBe("running");
  });

  it("should call onEnter and onExit hooks", async () => {
    await fsm.send("START");
    expect(onExitIdle).toHaveBeenCalled();
    expect(onEnterRunning).toHaveBeenCalled();

    await fsm.send("STOP");
    expect(onExitRunning).toHaveBeenCalled();
    expect(onEnterIdle).toHaveBeenCalledTimes(1); // initial + second entry
  });

  it("should correctly report state using is()", async () => {
    expect(fsm.is("idle")).toBe(true);
    expect(fsm.is("running")).toBe(false);

    await fsm.send("START");
    expect(fsm.is("running")).toBe(true);
    expect(fsm.is("idle")).toBe(false);
  });

  it("should return available events for current state", async () => {
    expect(fsm.availableEvents()).toEqual(["START"]);
    await fsm.send("START");
    expect(fsm.availableEvents()).toEqual(["STOP"]);
  });

  it("should reset to initial state", async () => {
    await fsm.send("START");
    fsm.reset();
    expect(fsm.current).toBe("idle");
    expect(fsm.previous).toBe("running"); // previous keeps last state
  });

  it("should handle multiple sequential transitions correctly", async () => {
    await fsm.send("START");
    expect(fsm.current).toBe("running");
    await fsm.send("STOP");
    expect(fsm.current).toBe("idle");
    await fsm.send("START");
    expect(fsm.current).toBe("running");
  });

  it("should handle states without on property", async () => {
    const fsm = new StateMachine({
      initial: "idle",
      states: {
        idle: {}, // no 'on' defined
      },
    });

    await expect(fsm.send("ANY" as any)).rejects.toThrow(
      'Invalid transition from "idle" with "ANY"'
    );
  });
});
