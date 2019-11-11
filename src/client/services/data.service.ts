import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ClientDto,
  KillStatsDto,
  MapDto,
  PersonDetailDto,
  PersonDto,
  KillStatsRestrictions,
  GameDto,
  GamePersonStatsDto,
  GamePersonStatsRestrictions
} from '../../shared';
import { mapTo, tap } from 'rxjs/operators';

@Injectable()
export class DataService {
  constructor(private http: HttpClient) {}

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

  getGame$(gameId: number): Observable<GameDto> {
    return this.http.get(`/api/game/${gameId}`, { responseType: 'json' }) as Observable<GameDto>;
  }

  addPerson$(name: string, fullName: undefined): Observable<PersonDto> {
    return this.http.post('/api/persons', { name, fullName }, { responseType: 'json' }) as Observable<PersonDto>;
  }

  assignPerson$(client: ClientDto, person: PersonDto): Observable<any> {
    return this.http.post('/api/clients', { id: client.id, personId: person.id }, { responseType: 'json' }) as Observable<any>;
  }

  getKillStats$(restrictions: KillStatsRestrictions = {}): Observable<KillStatsDto[]> {
    return this.http.post('/api/stats/kill', restrictions, { responseType: 'json' }) as Observable<KillStatsDto[]>;
  }

  getGamePersonStats$(restrictions: GamePersonStatsRestrictions): Observable<GamePersonStatsDto[]> {
    return this.http
      .post('/api/stats/game-person', restrictions, { responseType: 'json' })
      .pipe(tap((data: GamePersonStatsDto[]) => data.forEach(r => (r.game.startTime = new Date(r.game.startTime))))) as Observable<
      GamePersonStatsDto[]
    >;
  }

  refreshMaterializedViews$(): Observable<void> {
    return this.http.get('/api/refresh-materialized-views').pipe(mapTo(undefined)) as Observable<void>;
  }
}
