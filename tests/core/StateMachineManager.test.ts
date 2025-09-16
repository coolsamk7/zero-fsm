import { describe, it, expect } from "vitest";
import { StateMachineManager } from "@fsm/core";

describe("StateMachineManager", () => {
  it("should create and get named FSM", async () => {
    const manager = new StateMachineManager();
    manager.create("auth", {
      initial: "loggedOut",
      states: { loggedOut: { on: { LOGIN: "loggedIn" } }, loggedIn: { on: { LOGOUT: "loggedOut" } } },
    });

    const fsm = manager.get("auth");
    expect(fsm.current).toBe("loggedOut");

    await fsm.send("LOGIN");
    expect(fsm.current).toBe("loggedIn");
  });

  it("should throw error if FSM with same name exists", () => {
    const manager = new StateMachineManager();
    manager.create("auth", { initial: "a", states: { a: {} } });
    expect(() => manager.create("auth", { initial: "a", states: { a: {} } })).toThrow(
      'FSM "auth" already exists'
    );
  });

  it("should throw error if getting unknown FSM", () => {
    const manager = new StateMachineManager();
    expect(() => manager.get("nonexistent")).toThrow('FSM "nonexistent" not found');
  });

  it("should reset all FSMs", async () => {
    const manager = new StateMachineManager();
    manager.create("auth", { initial: "a", states: { a: { on: { B: "b" } }, b: {} } });
    manager.create("player", { initial: "x", states: { x: { on: { Y: "y" } }, y: {} } });

    const auth = manager.get("auth");
    const player = manager.get("player");

    await auth.send("B");
    await player.send("Y");

    manager.resetAll();
    expect(auth.current).toBe("a");
    expect(auth.previous).toBe("b");
    expect(player.current).toBe("x");
    expect(player.previous).toBe("y");
  });
});
