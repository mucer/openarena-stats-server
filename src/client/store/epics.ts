import { ActionsObservable, combineEpics, Epic, ofType, StateObservable } from 'redux-observable';
import { of, merge } from 'rxjs';
import { catchError, filter, map, mapTo, mergeMap } from 'rxjs/operators';
import { ActionType, ClientDto, PersonDto, AssignPersonAction, LoadKillStatsAction, SetKillStatsAction, AddErrorAction, PersonDetailDto, SetPersonDetailAction, SetPersonsAction, SetClientsAction, SetMapsAction, LoadPersonDetailAction, Actions } from '../../shared';
import { DataService } from '../services/data.service';
import { RootState } from './store';

export const rootEpic = (service: DataService): Epic => combineEpics(
    // LOAD_PERSONS
    (actions$: ActionsObservable<Actions>, state$: StateObservable<RootState>) => actions$.pipe(
        ofType(ActionType.LOAD_PERSONS),
        filter(() => !state$.value.persons.persons),
        mergeMap(() => merge(
            of({
                type: ActionType.SET_PERSONS,
                persons: []
            } as SetPersonsAction),
            service.getPersons$().pipe(
                map((persons: PersonDto[]) => ({
                    type: ActionType.SET_PERSONS,
                    persons
                } as SetPersonsAction)),
                catchError(error => of({
                    type: ActionType.ADD_ERROR,
                    error
                } as AddErrorAction))
            )
        ))
    ),
    // LOAD_PERSON_DETAIL
    (actions$: ActionsObservable<Actions>, state$: StateObservable<RootState>) => actions$.pipe(
        ofType(ActionType.LOAD_PERSON_DETAIL),
        filter((a: LoadPersonDetailAction) => !state$.value.persons.detail[a.personId]),
        mergeMap((a: LoadPersonDetailAction) => service.getPerson$(a.personId).pipe(
            map((person: PersonDetailDto) => ({
                type: ActionType.SET_PERSON_DETAIL,
                person
            } as SetPersonDetailAction)),
            catchError(error => of({
                type: ActionType.ADD_ERROR,
                error
            } as AddErrorAction))
        ))
    ),
    // LOAD_CLIENTS
    (actions$: ActionsObservable<Actions>, state$: StateObservable<RootState>) => actions$.pipe(
        ofType(ActionType.LOAD_CLIENTS),
        filter(() => !state$.value.clients.clients),
        mergeMap(() => service.getClients$().pipe(
            map((clients: ClientDto[]) => ({
                type: ActionType.SET_CLIENTS,
                clients
            } as SetClientsAction)),
            catchError(error => of({
                type: ActionType.ADD_ERROR,
                error
            } as AddErrorAction))
        ))
    ),
    // LOAD_MAPS
    (actions$: ActionsObservable<Actions>, state$: StateObservable<RootState>) => actions$.pipe(
        ofType(ActionType.LOAD_MAPS),
        filter(() => !state$.value.maps.maps),
        mergeMap(() => service.getMaps$().pipe(
            map(maps => ({
                type: ActionType.SET_MAPS,
                maps
            } as SetMapsAction)),
            catchError(error => of({
                type: ActionType.ADD_ERROR,
                error
            } as AddErrorAction))
        ))
    ),
    // LOAD_KILL_STATS
    (actions$: ActionsObservable<Actions>, state$: StateObservable<RootState>) => actions$.pipe(
        ofType(ActionType.LOAD_KILL_STATS),
        filter((a: LoadKillStatsAction) => !state$.value.stats.kill[a.id]),
        mergeMap((action: LoadKillStatsAction) => service.getKillStats$(action.restrictions).pipe(
            map(stats => ({
                type: ActionType.SET_KILL_STATS,
                id: action.id,
                restrictions: action.restrictions,
                stats
            } as SetKillStatsAction)),
            catchError(error => of({
                type: ActionType.ADD_ERROR,
                error
            } as AddErrorAction))
        ))
    ),
    // ASSIGN_PERSON
    (actions$: ActionsObservable<Actions>, state$: StateObservable<RootState>) => actions$.pipe(
        ofType(ActionType.ASSIGN_PERSON),
        // ignore if person already set
        filter((action: AssignPersonAction) => !action.person),
        mergeMap((action: AssignPersonAction) => {
            const client: ClientDto = action.client;
            const personName: string = typeof action.personName === 'string' ? (action.personName as string).toUpperCase() : '';
            const existingPerson: PersonDto | undefined = personName ? state$.value.persons.persons.find(p => p.name === personName) : undefined;

            // send assignment to backend and wait for response with person id
            if (!existingPerson) {
                return service.addPerson$(personName, undefined).pipe(
                    mergeMap(person => service.assignPerson$(client, person).pipe(
                        mapTo({
                            type: ActionType.ASSIGN_PERSON,
                            client,
                            person
                        } as AssignPersonAction))),
                    catchError(error => of({
                        type: ActionType.ADD_ERROR,
                        error
                    } as AddErrorAction))
                );
            } else {
                return service.assignPerson$(client, existingPerson).pipe(
                    mapTo({
                        type: ActionType.ASSIGN_PERSON,
                        client,
                        person: existingPerson
                    } as AssignPersonAction));
            }
        })
    )
);
