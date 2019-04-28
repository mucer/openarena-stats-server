import { StatRestrictionsDto } from 'src/shared';

export const StoreUtil = {
    getKillStatId: (rest: StatRestrictionsDto): string => {
        return [rest.fromPersonId, rest.toPersonId, rest.fromDate, rest.toDate, rest.cause, rest.map, rest.gameType]
            .map(x => x || '')
            .join('-');
    }
}