import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ClientDto, PersonDto, PersonDetailDto } from '@shared';

@Injectable()
export class DataService {
    constructor(private http: HttpClient) {
    }

    public getPersons(): Observable<PersonDto[]> {
        return this.http.get('/api/persons', {
            responseType: 'json'
        }) as Observable<PersonDto[]>;
    }

    public getPerson(name: string): Observable<PersonDetailDto> {
        return this.http.get(`/api/person/${name}`, {
            responseType: 'json'
        }) as Observable<PersonDetailDto>;
    }

    public getClients(): Observable<ClientDto[]> {
        return this.http.get('/api/clients', {
            responseType: 'json'
        }) as Observable<ClientDto[]>;
    }

    public addPerson(name: string, fullName: undefined): Observable<PersonDto> {
        return this.http.post('/api/persons', { name, fullName }, { responseType: 'json' }) as Observable<PersonDto>
    }

    public assignPerson(client: ClientDto, person: PersonDto): Observable<any> {
        return this.http.post('/api/clients', { id: client.id, personId: person.id }, { responseType: 'json' }) as Observable<any>
    }
}