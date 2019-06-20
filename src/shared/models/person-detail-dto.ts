import { PersonDto } from './person-dto';
import { MeanOfDeath } from '../constants/mean-of-death';

export interface PersonDetailDto extends PersonDto {
    totalTime: number;
    totalGames: number;
    finishedGames: number;
    clientIds: number[];
    killsWith: { cause: string, num: number }[];
}
