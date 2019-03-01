import { ClientDto, PersonDto, PersonDetailDto } from '@shared';

export interface State {
    persons: PersonDto[] | undefined;
    clients: ClientDto[] | undefined;
    personDetail: {[id: string]: PersonDetailDto };
}

export const INITIAL_STATE: State = {
    persons: undefined,
    clients: undefined,
    personDetail: {}
};
