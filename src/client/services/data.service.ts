import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ClientDto, PersonDto, PersonDetailDto, MapDto, KillStatsDto, StatRestrictionsDto, assign } from '../../shared';
import { map } from 'rxjs/operators';
import { rootEpic } from '../store/epics';

@Injectable()
export class DataService {
    constructor(private http: HttpClient) {
    }

    getPersons(): Observable<PersonDto[]> {
        return this.http.get('/api/persons', {
            responseType: 'json'
        }) as Observable<PersonDto[]>;
    }

    getPerson(name: string): Observable<PersonDetailDto> {
        return this.http.get(`/api/person/${name}`, {
            responseType: 'json'
        }) as Observable<PersonDetailDto>;
    }

    getClients(): Observable<ClientDto[]> {
        return this.http.get('/api/clients', {
            responseType: 'json'
        }) as Observable<ClientDto[]>;
    }

    getMaps(): Observable<MapDto[]> {
        return this.http.get('/api/maps', {
            responseType: 'json'
        }) as Observable<MapDto[]>;
    }

    addPerson(name: string, fullName: undefined): Observable<PersonDto> {
        return this.http.post('/api/persons', { name, fullName }, { responseType: 'json' }) as Observable<PersonDto>
    }

    assignPerson(client: ClientDto, person: PersonDto): Observable<any> {
        return this.http.post('/api/clients', { id: client.id, personId: person.id }, { responseType: 'json' }) as Observable<any>
    }

    getKillStats(restrictions: StatRestrictionsDto = {}): Observable<KillStatsDto[]> {
        return this.http.post('/api/stats', restrictions, { responseType: 'json' }) as Observable<KillStatsDto[]>
    }
}