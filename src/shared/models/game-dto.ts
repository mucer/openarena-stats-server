import { GameType } from '@shared';

export interface GameDto {
    id: number;
    map: string;
    type: GameType;
    startTime: Date;
}
