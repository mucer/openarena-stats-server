import { Reducer, AnyAction } from 'redux';
import { State } from './state';
import { assign, ActionType, PersonDto, ClientDto } from '@shared';

export const rootReducer: Reducer = (state: State, action: AnyAction): State => {
    switch (action.type) {
        case ActionType.SET_PERSONS:
            return assign(state, { persons: action.payload });
        case ActionType.SET_PERSON_DETAIL:
            return assign(state, { personDetail: assign(state.personDetail, { [action.payload.id]: action.payload }) });
        case ActionType.SET_CLIENTS:
            return assign(state, { clients: action.payload });
        case ActionType.ADD_PERSON:
            return assign(state, { persons: [...state.persons, action.payload] });
        case ActionType.ASSIGN_PERSON: {
            const person: PersonDto | undefined = action.payload.person;
            const persons: PersonDto[] = person && !state.persons.some(p => p.id === person.id)
                ? [...state.persons, person]
                : state.persons;
            const clients: ClientDto[] = state.clients.map(c => c.id === action.payload.client.id
                ? assign(c, {
                    personId: person ? person.id : undefined,
                    personName: person ? person.name : undefined
                })
                : c);

            return assign(state, { clients, persons });
        }
        default:
            return state;
    }
};
