import { DevToolsExtension, NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { createEpicMiddleware } from 'redux-observable';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { ActionType, ClientDto, KillStatsDto, StatRestrictionsDto, MapDto, PersonDetailDto, PersonDto } from '../../shared';
import { DataService } from '../services/data.service';
import { rootEpic } from './epics';
import { rootReducer } from './root-reducer';
import { INITIAL_STATE, State } from './state';
import { StoreUtil } from './store-util';

@Injectable()
export class Store {

    public readonly state$ = new BehaviorSubject<State>(INITIAL_STATE);

    public readonly persons$: Observable<PersonDto[] | undefined> = this.state$.pipe(map(s => s.persons), distinctUntilChanged());

    public readonly clients$: Observable<ClientDto[] | undefined> = this.state$.pipe(map(s => s.clients), distinctUntilChanged());

    public readonly maps$: Observable<MapDto[] | undefined> = this.state$.pipe(map(s => s.maps), distinctUntilChanged());

    constructor(
        private redux: NgRedux<State>,
        devTools: DevToolsExtension,
        dataService: DataService
    ) {
        const epicMiddleware = createEpicMiddleware();
        redux.configureStore(
            rootReducer,
            this.state$.getValue(),
            [epicMiddleware],
            devTools.isEnabled() ? [devTools.enhancer()] : []);

        epicMiddleware.run(rootEpic(dataService));

        redux.subscribe(() => {
            this.state$.next(redux.getState());
        });
    }

    loadClients() {
        this.redux.dispatch({ type: ActionType.LOAD_CLIENTS });
    }

    loadPersons() {
        this.redux.dispatch({ type: ActionType.LOAD_PERSONS });
    }

    loadMaps() {
        this.redux.dispatch({ type: ActionType.LOAD_MAPS });
    }

    assignPerson(client: ClientDto, personName: string) {
        this.redux.dispatch({ type: ActionType.ASSIGN_PERSON, payload: { client, personName } });
    }

    loadPersonDetail(id: string): Observable<PersonDetailDto | undefined> {
        this.redux.dispatch({ type: ActionType.LOAD_PERSON_DETAIL, payload: id });
        return this.state$.pipe(map(s => s.personDetail[id]), distinctUntilChanged());
    }

    loadKillStats(restrictions: StatRestrictionsDto): Observable<KillStatsDto[] | undefined> {
        const id = StoreUtil.getKillStatId(restrictions);
        this.redux.dispatch({ type: ActionType.LOAD_KILL_STATS, payload: { id, restrictions } });
        return this.state$.pipe(map(s => s.killStats[id]), distinctUntilChanged());
    }
}