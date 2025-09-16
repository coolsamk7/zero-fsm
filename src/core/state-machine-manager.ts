import {  StateMachineConfig } from "@fsm/types";
import { StateMachine } from "./state-machine";

export class StateMachineManager {
  private machines = new Map<string, StateMachine<any, any>>();

  create<TStates extends string, TEvents extends string>(
    name: string,
    config: StateMachineConfig<TStates, TEvents>
  ) {
    if (this.machines.has(name)) throw new Error(`FSM "${name}" already exists`);
    this.machines.set(name, new StateMachine(config));
  }

  get<TStates extends string, TEvents extends string>(name: string): StateMachine<TStates, TEvents> {
    const fsm = this.machines.get(name);
    if (!fsm) throw new Error(`FSM "${name}" not found`);
    return fsm;
  }

  resetAll() {
    for (const fsm of this.machines.values()) {
      fsm.reset();
    }
  }
}
