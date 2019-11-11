import { MeanOfDeath } from '../constants/mean-of-death';
import { GameType } from '../constants/game-type';

export interface GameRestrictions {
    gameId?: number;
    fromDate?: string;
    toDate?: string;
    map?: string;
    gameType?: GameType;
}

export interface KillStatsRestrictions extends GameRestrictions {
    fromPersonId?: number;
    toPersonId?: number;
    cause?: MeanOfDeath;
    limit?: number;
}

export interface GamePersonStatsRestrictions extends GameRestrictions {
    personId?: number;
    limit?: number;
}
