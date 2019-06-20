import { DevToolsExtension, NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { combineReducers, Reducer } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { ActionType, AssignPersonAction, ClientDto, KillStatsDto, KillStatsRestrictionsDto, LoadKillStatsAction, LoadPersonDetailAction, MapDto, PersonDetailDto, PersonDto } from '../../shared';
import { DataService } from '../services/data.service';
import { rootEpic } from './epics';
import { reducer as clientsReducer, State as ClientsState } from './slices/clients-slice';
import { reducer as mapsReducer, State as MapsState } from './slices/maps-slice';
import { reducer as personsReducer, State as PersonsState } from './slices/persons-slice';
import { reducer as statsReducer, State as StatsState } from './slices/stats-slice';
import { StoreUtil } from './store-util';

export interface RootState {
    persons: PersonsState;
    clients: ClientsState;
    maps: MapsState;
    stats: StatsState;
}

const rootReducer: Reducer<RootState> = combineReducers({
    persons: personsReducer,
    clients: clientsReducer,
    maps: mapsReducer,
    stats: statsReducer
});

const INITIAL_VALUE: RootState = rootReducer(undefined, { type: 'INIT '});

@Injectable()
export class Store {
    private readonly state$ = new BehaviorSubject<RootState>(INITIAL_VALUE);

    public readonly persons$: Observable<PersonDto[] | undefined> = this.state$.pipe(map(s => s.persons.persons), distinctUntilChanged());

    public readonly clients$: Observable<ClientDto[] | undefined> = this.state$.pipe(map(s => s.clients.clients), distinctUntilChanged());

    public readonly maps$: Observable<MapDto[] | undefined> = this.state$.pipe(map(s => s.maps.maps), distinctUntilChanged());

    constructor(
        private redux: NgRedux<RootState>,
        devTools: DevToolsExtension,
        dataService: DataService
    ) {
        const epicMiddleware = createEpicMiddleware();
        redux.configureStore(
            rootReducer,
            undefined,
            [epicMiddleware],
            devTools.isEnabled() ? [devTools.enhancer()] : []);

        epicMiddleware.run(rootEpic(dataService));

        redux.subscribe(() => {
            this.state$.next(redux.getState());
        });
    }

    getState(): RootState | undefined {
        return this.state$.getValue();
    }

    getClients$(): Observable<ClientDto[] | undefined> {
        if (!this.getState().clients.loading) {
            this.redux.dispatch({ type: ActionType.LOAD_CLIENTS });
        }
        return this.clients$;
    }

    getPersons$(): Observable<PersonDto[] | undefined> {
        if (!this.getState().persons.loading) {
            this.redux.dispatch({ type: ActionType.LOAD_PERSONS });
        }
        return this.persons$;
    }

    getPerson$(id: number): Observable<PersonDto> {
        return this.getPersons$().pipe(map(ary => ary && ary.find(p => p.id === id)), distinctUntilChanged());
    }

    getMaps$(): Observable<MapDto[] | undefined> {
        if (!this.state$.getValue().maps.loading) {
            this.redux.dispatch({ type: ActionType.LOAD_MAPS });
        }
        return this.maps$;
    }

    getMap$(name: string): Observable<MapDto | undefined> {
        return this.getMaps$().pipe(map(ary => ary && ary.find(m => m.name === name)), distinctUntilChanged());
    }

    assignPerson(client: ClientDto, personName: string): void {
        this.redux.dispatch({ type: ActionType.ASSIGN_PERSON, client, personName } as AssignPersonAction);
    }

    getPersonDetail$(personId: number): Observable<PersonDetailDto | undefined> {
        this.redux.dispatch({ type: ActionType.LOAD_PERSON_DETAIL, personId } as LoadPersonDetailAction);
        return this.state$.pipe(map(s => s.persons.detail[personId]), distinctUntilChanged());
    }

    getKillStats$(restrictions: KillStatsRestrictionsDto): Observable<KillStatsDto[] | undefined> {
        const id = StoreUtil.getKillStatId(restrictions);
        this.redux.dispatch({ type: ActionType.LOAD_KILL_STATS, id, restrictions } as LoadKillStatsAction);
        return this.state$.pipe(map(s => s.stats.kill && s.stats.kill[id]), distinctUntilChanged());
    }
}
