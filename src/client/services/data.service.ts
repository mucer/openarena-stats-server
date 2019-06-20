import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientDto, KillStatsDto, MapDto, PersonDetailDto, PersonDto, KillStatsRestrictionsDto } from '../../shared';

@Injectable()
export class DataService {
    constructor(private http: HttpClient) {
    }

    getPersons$(): Observable<PersonDto[]> {
        return this.http.get('/api/persons', {
            responseType: 'json'
        }) as Observable<PersonDto[]>;
    }

    getPerson$(id: number): Observable<PersonDetailDto> {
        return this.http.get(`/api/person/${id}`, {
            responseType: 'json'
        }) as Observable<PersonDetailDto>;
    }

    getClients$(): Observable<ClientDto[]> {
        return this.http.get('/api/clients', {
            responseType: 'json'
        }) as Observable<ClientDto[]>;
    }

    getMaps$(): Observable<MapDto[]> {
        return this.http.get('/api/maps', {
            responseType: 'json'
        }) as Observable<MapDto[]>;
    }

    addPerson$(name: string, fullName: undefined): Observable<PersonDto> {
        return this.http.post('/api/persons', { name, fullName }, { responseType: 'json' }) as Observable<PersonDto>;
    }

    assignPerson$(client: ClientDto, person: PersonDto): Observable<any> {
        return this.http.post('/api/clients', { id: client.id, personId: person.id }, { responseType: 'json' }) as Observable<any>;
    }

    getKillStats$(restrictions: KillStatsRestrictionsDto = {}): Observable<KillStatsDto[]> {
        return this.http.post('/api/kill-stats', restrictions, { responseType: 'json' }) as Observable<KillStatsDto[]>;
    }
}
