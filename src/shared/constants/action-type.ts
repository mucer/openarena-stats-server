import { Action } from 'redux';
import { ClientDto } from '../models/client-dto';
import { KillStatsRestrictions, GamePersonStatsRestrictions } from '../models/restrictions';
import { KillStatsDto } from '../models/kill-stats-dto';
import { PersonDetailDto } from '../models/person-detail-dto';
import { MapDto } from '../models/map-dto';
import { PersonDto } from '../models/person-dto';
import { GameDto } from '../models/game-dto';
import { GamePersonStatsDto } from '../models/game-person-stats-dto';

export enum ActionType {
    ADD_ERROR = 'ADD_ERROR',
    ADD_PERSON = 'ADD_PERSON',
    ASSIGN_PERSON = 'ASSIGN_PERSON',
    LOAD_CLIENTS = 'LOAD_CLIENTS',
    LOAD_KILL_STATS = 'LOAD_KILL_STATS',
    LOAD_MAPS = 'LOAD_MAPS',
    LOAD_PERSON_DETAIL = 'LOAD_PERSON_DETAIL',
    LOAD_PERSONS = 'LOAD_PERSONS',
    SET_CLIENTS = 'SET_CLIENTS',
    SET_KILL_STATS = 'SET_KILL_STATS',
    SET_MAPS = 'SET_MAPS',
    SET_PERSON_DETAIL = 'SET_PERSON_DETAIL',
    SET_PERSONS = 'SET_PERSONS',
    LOAD_GAME = 'LOAD_GAME',
    SET_GAME = 'SET_GAME',
    LOAD_GAME_PERSON_STATS = 'LOAD_GAME_PERSON_STATS',
    SET_GAME_PERSON_STATS = 'SET_GAME_PERSON_STATS',
    REFRESH_MATERIALIZED_VIEWS = 'REFRESH_MATERIALIZED_VIEWS',
    MATERIALIZED_VIEWS_REFRESHED = 'MATERIALIZED_VIEWS_REFRESHED'
}


export interface AddErrorAction extends Action {
    type: ActionType.ADD_ERROR;
    error: Error | string;
}

export interface AddPerson extends Action {
    type: ActionType.ADD_PERSON;
    person: PersonDto;
}

export interface AssignPersonAction extends Action {
    type: ActionType.ASSIGN_PERSON;
    client: ClientDto;
    personName: string;
    person?: PersonDto;
}

export interface LoadClientsAction extends Action {
    type: ActionType.LOAD_CLIENTS;
}

export interface LoadMapsAction extends Action {
    type: ActionType.LOAD_MAPS;
}

export interface LoadPersonDetailAction extends Action {
    type: ActionType.LOAD_PERSON_DETAIL;
    personId: number;
}

export interface LoadPersonsAction extends Action {
    type: ActionType.LOAD_PERSONS;
}

export interface LoadKillStatsAction extends Action {
    type: ActionType.LOAD_KILL_STATS;
    id: string;
    restrictions: KillStatsRestrictions;
}

export interface SetKillStatsAction extends Action {
    type: ActionType.SET_KILL_STATS;
    id: string;
    stats: KillStatsDto[];
}

export interface SetClientsAction extends Action {
    type: ActionType.SET_CLIENTS;
    clients: ClientDto[];
}

export interface SetMapsAction extends Action {
    type: ActionType.SET_MAPS;
    maps: MapDto[];
}

export interface SetPersonDetailAction extends Action {
    type: ActionType.SET_PERSON_DETAIL;
    person: PersonDetailDto;
}

export interface SetPersonsAction extends Action {
    type: ActionType.SET_PERSONS;
    persons: PersonDetailDto[];
}

export interface LoadGameAction extends Action {
    type: ActionType.LOAD_GAME;
    gameId: number;
}

export interface SetGameAction extends Action {
    type: ActionType.SET_GAME;
    game: GameDto;
}

export interface LoadGamePersonStatsAction extends Action {
    type: ActionType.LOAD_GAME_PERSON_STATS;
    id: string;
    restrictions: GamePersonStatsRestrictions;
}

export interface SetGamePersonStatsAction extends Action {
    type: ActionType.SET_GAME_PERSON_STATS;
    id: string;
    stats: GamePersonStatsDto[];
}

export interface RefreshMaterializedViewsAction extends Action {
    type: ActionType.REFRESH_MATERIALIZED_VIEWS;
}

export interface MaterializedViewsRefreshedAction extends Action {
    type: ActionType.MATERIALIZED_VIEWS_REFRESHED;
}

export type Actions = AddErrorAction
    | AddPerson
    | AssignPersonAction
    | LoadClientsAction
    | LoadMapsAction
    | LoadPersonDetailAction
    | LoadPersonsAction
    | LoadKillStatsAction
    | SetKillStatsAction
    | SetClientsAction
    | SetMapsAction
    | SetPersonDetailAction
    | SetPersonsAction
    | LoadGameAction
    | SetGameAction
    | LoadGamePersonStatsAction
    | SetGamePersonStatsAction
    | RefreshMaterializedViewsAction
    | MaterializedViewsRefreshedAction;
