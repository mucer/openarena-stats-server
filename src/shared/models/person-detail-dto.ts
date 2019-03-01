import { PersonDto } from './person-dto';

export interface PersonDetailDto extends PersonDto {
    clientIds: number[];
}
