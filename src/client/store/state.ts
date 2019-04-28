import { ClientDto, MapDto, PersonDetailDto, PersonDto, KillStatsDto } from '../../shared';

export interface State {
    persons: PersonDto[] | undefined;
    clients: ClientDto[] | undefined;
    maps: MapDto[] | undefined;
    personDetail: {[id: string]: PersonDetailDto };
    killStats: {[id: string]: KillStatsDto[] };
}

export const INITIAL_STATE: State = {
    persons: undefined,
    clients: undefined,
    maps: undefined,
    personDetail: {},
    killStats: {}
};
