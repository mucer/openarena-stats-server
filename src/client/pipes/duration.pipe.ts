import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'appDuration'
})
export class DurationPipe implements PipeTransform  {
    transform(duration: number): string {
        const seconds = duration % 60;
        const totalMinutes = (duration - seconds) / 60;
        const minutes = totalMinutes % 60;
        const hours = (totalMinutes - minutes) / 60;

        let result = `${seconds}s`;
        if (minutes > 0) {
            result = `${minutes}m ${result}`;
        }
        if (hours > 0) {
            result = `${hours}h ${result}`;
        }

        return result;
    }
}
