import { NgRedux, DevToolsExtension } from '@angular-redux/store';
import { State, INITIAL_STATE } from './state';
import { DataService } from './services/data.service';
import { rootReducer } from './root-reducer';
import { createEpicMiddleware } from 'redux-observable';
import { rootEpic } from './epics';
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { PersonDto, ClientDto, ActionType, PersonDetailDto } from '@shared';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';

@Injectable()
export class Store {

    public readonly state$ = new BehaviorSubject<State>(INITIAL_STATE);

    public readonly persons$: Observable<PersonDto[] | undefined> = this.state$.pipe(map(s => s.persons), distinctUntilChanged(), tap(p => console.log('persons', p)));

    public readonly clients$: Observable<ClientDto[] | undefined> = this.state$.pipe(map(s => s.clients), distinctUntilChanged());

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

    assignPerson(client: ClientDto, personName: string) {
        this.redux.dispatch({ type: ActionType.ASSIGN_PERSON, payload: { client, personName } });
    }

    loadPersonDetail(id: string): Observable<PersonDetailDto | undefined> {
        this.redux.dispatch({type: ActionType.LOAD_PERSON_DETAIL, payload: id});
        return this.state$.pipe(map(s => s.personDetail[id]), distinctUntilChanged());
    }
}