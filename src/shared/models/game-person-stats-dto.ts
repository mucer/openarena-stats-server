import { GameDto } from './game-dto';

export interface GamePersonStatsDto {
    game: GameDto;
    personId: number;
    awardPoints: number;
    killPoints: number;
    seconds: number;
    kills: number;
    teamKills: number;
    deaths: number;
    teamDeaths: number;
}
