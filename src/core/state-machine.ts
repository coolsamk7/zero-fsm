import { StateMachineConfig } from "@fsm/interfaces";

export class StateMachine<TStates extends string, TEvents extends string> {
    private current: TStates;
    private config: StateMachineConfig<TStates, TEvents>;

    constructor(config: StateMachineConfig<TStates, TEvents>) {
        this.config = config;
        this.current = config.initial;
    }

    get state(): TStates {
        return this.current;
    }

    async send(event: TEvents): Promise<void> {
        const stateDef = this.config.states[this.current];
        const nextState = stateDef.on?.[event];

        if (!nextState) {
            throw new Error(`Invalid transition from ${this.current} on ${event}`);
        }

        if (stateDef.onExit) {
            await stateDef.onExit();
        }

        this.current = nextState;

        const nextDef = this.config.states[this.current];
        if (nextDef.onEnter) {
            await nextDef.onEnter();
        }
    }
}