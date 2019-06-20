import { Actions, KillStatsDto, ActionType, assign } from '../../../shared';
import { Reducer } from 'redux';

export interface State {
    kill: { [id: string]: KillStatsDto[] };
}

const INITIAL_STATE: State = {
    kill: {}
};

export const reducer: Reducer = (state: State = INITIAL_STATE, action: Actions): State => {
    switch (action.type) {
        case ActionType.SET_KILL_STATS:
            return assign(state, {
                kill: assign(state.kill, { [action.id]: action.stats })
            });
        default:
            return state;
    }
};
