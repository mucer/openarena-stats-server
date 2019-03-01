import { Epic, ActionsObservable, StateObservable, ofType, combineEpics } from 'redux-observable';
import { AnyAction } from 'redux';
import { filter, mergeMap, map, catchError, mapTo } from 'rxjs/operators';
import { ActionType, ClientDto, PersonDto } from '@shared';
import { of } from 'rxjs';
import { DataService } from './services/data.service';
import { State } from './state';

export const rootEpic = (service: DataService): Epic => combineEpics(
    // LOAD_PERSONS
    (actions$: ActionsObservable<AnyAction>, state$: StateObservable<State>) => actions$.pipe(
        ofType(ActionType.LOAD_PERSONS),
        filter(() => !state$.value.persons),
        mergeMap(() => service.getPersons().pipe(
            map(persons => ({
                type: ActionType.SET_PERSONS,
                payload: persons
            })),
            catchError(err => of({
                type: ActionType.ADD_ERROR,
                payload: err
            }))
        ))
    ),
    // LOAD_PERSON_DETAIL
    (actions$: ActionsObservable<AnyAction>, state$: StateObservable<State>) => actions$.pipe(
        ofType(ActionType.LOAD_PERSON_DETAIL),
        filter(a => !state$.value.personDetail[a.payload]),
        mergeMap(a => service.getPerson(a.payload).pipe(
            map(data => ({
                type: ActionType.SET_PERSON_DETAIL,
                payload: data
            })),
            catchError(err => of({
                type: ActionType.ADD_ERROR,
                payload: err
            }))
        ))
    ),
    // LOAD_CLIENTS
    (actions$: ActionsObservable<AnyAction>, state$: StateObservable<State>) => actions$.pipe(
        ofType(ActionType.LOAD_CLIENTS),
        filter(() => !state$.value.persons),
        mergeMap(() => service.getClients().pipe(
            map(persons => ({
                type: ActionType.SET_CLIENTS,
                payload: persons
            })),
            catchError(err => of({
                type: ActionType.ADD_ERROR,
                payload: err
            }))
        ))
    ),
    // ASSIGN_PERSON
    (actions$: ActionsObservable<AnyAction>, state$: StateObservable<State>) => actions$.pipe(
        ofType(ActionType.ASSIGN_PERSON),
        // ignore if person already set
        filter(action => !action.payload.person),
        mergeMap(action => {
            const client: ClientDto = action.payload.client;
            const personName: string = typeof action.payload.personName === 'string' ? (action.payload.personName as string).toUpperCase() : '';
            const existingPerson: PersonDto | undefined = personName ? state$.value.persons.find(p => p.name === personName) : undefined;

            // send assignment to backend and wait for response with person id
            if (!existingPerson) {
                return service.addPerson(personName, undefined).pipe(
                    mergeMap(person => service.assignPerson(client, person).pipe(
                        mapTo({
                            type: ActionType.ASSIGN_PERSON,
                            payload: { client, person }
                        } as AnyAction))),
                    catchError(err => of({
                        type: ActionType.ADD_ERROR,
                        payload: err
                    }))
                );
            } else {
                return service.assignPerson(client, existingPerson).pipe(
                    mapTo({
                        type: ActionType.ASSIGN_PERSON,
                        payload: { client, person: existingPerson }
                    } as AnyAction));
            }

        })
    )
);