import { ClientDto, Actions, ActionType, assign } from '../../../shared';
import { Reducer } from 'redux';

export interface State {
    loading: boolean;
    clients?: ClientDto[];
}

const INITIAL_STATE: State = {
    loading: false
};

export const reducer: Reducer = (state: State = INITIAL_STATE, action: Actions): State => {
    switch (action.type) {
        case ActionType.LOAD_CLIENTS:
            return assign(state, {
                loading: true
            });
        case ActionType.SET_CLIENTS:
            return assign(state, {
                loading: false,
                clients: action.clients
            });
        case ActionType.ASSIGN_PERSON: {
            const clients: ClientDto[] = state.clients.map(c => c.id === action.client.id
                ? assign(c, {
                    personId: action.person && action.person.id,
                    personName: action.person && action.person.name
                })
                : c);

            return assign(state, { clients });
        }
        default:
            return state;
    }
};
