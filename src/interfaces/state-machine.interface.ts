import { Event, StateCallback } from "@fsm/types";

export interface StateDefinition<TStates extends string> {
    on?: Partial<Record<Event, TStates>>;
    onEnter?: StateCallback;
    onExit?: StateCallback;
}


export interface StateMachineConfig<
    TStates extends string,
    TEvents extends string
> {
    initial: TStates;
    states: Record<TStates, StateDefinition<TStates>>;
}