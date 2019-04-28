import { GameType } from '../constants/game-type';

export interface GameDto {
    id: number;
    map: string;
    type: GameType;
    startTime: Date;
}
