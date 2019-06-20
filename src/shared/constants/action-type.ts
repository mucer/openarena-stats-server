import { Action } from 'redux';
import { ClientDto } from '../models/client-dto';
import { KillStatsRestrictionsDto } from '../models/kill-stats-restrictions-dto';
import { KillStatsDto } from '../models/kill-stats-dto';
import { PersonDetailDto } from '../models/person-detail-dto';
import { MapDto } from '../models/map-dto';
import { PersonDto } from '../models/person-dto';

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
    SET_PERSONS = 'SET_PERSONS'
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
    restrictions: KillStatsRestrictionsDto;
}

export interface SetKillStatsAction extends Action {
    type: ActionType.SET_KILL_STATS;
    id: string;
    restrictions: KillStatsRestrictionsDto;
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
    | SetPersonsAction;
