import { MeanOfDeath } from '../constants/mean-of-death';
import { GameType } from '../constants/game-type';

export interface StatRestrictionsDto {
    fromPersonId?: number;
    toPersonId?: number;
    fromDate?: string;
    toDate?: string;
    cause?: MeanOfDeath;
    map?: string;
    gameType?: GameType;
}
