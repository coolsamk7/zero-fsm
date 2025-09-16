import { StateMachineConfig } from "@fsm/types";

export class StateMachine<TStates extends string, TEvents extends string> {
  private config: StateMachineConfig<TStates, TEvents>;
  public current: TStates;
  public previous?: TStates;

  constructor(config: StateMachineConfig<TStates, TEvents>) {
    this.config = config;
    this.current = config.initial;
  }

  async send(event: TEvents) {
    const state = this.config.states[this.current];
    const nextState = state.on?.[event];
    if (!nextState) throw new Error(`Invalid transition from "${this.current}" with "${event}"`);

    if (state.onExit) await state.onExit();
    this.previous = this.current;
    this.current = nextState;
    const next = this.config.states[this.current];
    if (next.onEnter) await next.onEnter();
  }

  is(state: TStates) {
    return this.current === state;
  }

  availableEvents(): TEvents[] {
    return Object.keys(this.config.states[this.current].on || {}) as TEvents[];
  }

  reset() {
    this.previous = this.current;
    this.current = this.config.initial;
  }
}
