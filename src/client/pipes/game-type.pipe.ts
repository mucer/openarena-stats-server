import { Pipe, PipeTransform } from '@angular/core';
import { GameType } from 'src/shared';

@Pipe({
  name: 'appGameType'
})
export class GameTypePipe implements PipeTransform {
    transform(value: any) {
        return typeof value === 'number' ? GameType[value] : value;
    }
}
