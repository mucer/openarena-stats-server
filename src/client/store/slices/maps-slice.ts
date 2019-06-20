import { Reducer } from 'redux';
import { MapDto, Actions, ActionType, assign } from '../../../shared';

export interface State {
    loading: boolean;
    maps?: MapDto[];
}

const INITIAL_STATE: State = {
    loading: false
};

export const reducer: Reducer = (state: State = INITIAL_STATE, action: Actions): State => {
    switch (action.type) {
        case ActionType.LOAD_MAPS:
            return assign(state, {
                loading: true
            });
        case ActionType.SET_MAPS:
            return assign(state, {
                loading: false,
                maps: action.maps
            });
        default:
            return state;
    }
};
