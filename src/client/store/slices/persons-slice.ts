import { PersonDto, PersonDetailDto, Actions, ActionType, assign } from '../../../shared';
import { Reducer } from 'redux';

export interface State {
    loading: boolean;
    persons?: PersonDto[];
    detail: { [id: number]: PersonDetailDto };
}

const INITIAL_STATE: State = {
    loading: false,
    detail: {}
};

export const reducer: Reducer = (state: State = INITIAL_STATE, action: Actions): State => {
    switch (action.type) {
        case ActionType.LOAD_PERSONS:
            return assign(state, {
                loading: true
            });
        case ActionType.SET_PERSONS:
            return assign(state, {
                loading: false,
                persons: action.persons
            });
        case ActionType.SET_PERSON_DETAIL:
            return assign(state, {
                detail: assign(state.detail, { [action.person.id]: action.person })
            });
        case ActionType.ADD_PERSON:
        case ActionType.ASSIGN_PERSON:
            return action.person && !state.persons.some(p => p.id === action.person.id)
                ? assign(state, { persons: [...state.persons, action.person] })
                : state;
        default:
            return state;
    }
};
