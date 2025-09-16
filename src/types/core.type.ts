export type StateConfig<TStates extends string, TEvents extends string> = {
  on?: Partial<Record<TEvents, TStates>>;
  onEnter?: () => void | Promise<void>;
  onExit?: () => void | Promise<void>;
};

export type StateMachineConfig<TStates extends string, TEvents extends string> = {
  initial: TStates;
  states: Record<TStates, StateConfig<TStates, TEvents>>;
};
