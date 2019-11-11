import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { GamePersonStatsDto, MeanOfDeath, PersonDetailDto } from '../../../shared';
import { Store } from '../../store/store';

interface Details extends PersonDetailDto {
    favWeapon?: { name: string, kills: number };
}

@Component({
    selector: 'app-person',
    templateUrl: 'person-page.component.html',
    styleUrls: [ 'person-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonPageComponent implements OnInit {
    public data$: Observable<Details>;

    public gameStats$: Observable<GamePersonStatsDto[]>;

    constructor(private store: Store, private route: ActivatedRoute) {
    }

    public ngOnInit() {
        this.route.params.subscribe(params => {
            this.data$ = this.store.getPersonDetail$(+params.id).pipe(filter(Boolean), map((person: PersonDetailDto) => {
                const killsWith: number[] = [];
                let favWeapon: { name: string, kills: number } | undefined;

                person.killsWith.forEach(k => {
                    const cause = mapMeanOfDeath(k.cause);
                    const num = killsWith[cause] = (killsWith[cause] || 0) + k.num;
                    if (!favWeapon || num > favWeapon.kills) {
                        favWeapon = { name: MeanOfDeath[cause], kills: num };
                    }
                });

                return { ...person, favWeapon };
            }));
            this.gameStats$ = this.store.getGamePersonStats$({
                personId: +params.id,
                limit: 30
            });
        });
    }
}


function mapMeanOfDeath(causeStr: string): MeanOfDeath {
    const cause: MeanOfDeath = MeanOfDeath[causeStr];
    switch (cause) {
        case MeanOfDeath.BFG_SPLASH:
            return MeanOfDeath.BFG;
        case MeanOfDeath.GRENADE_SPLASH:
            return MeanOfDeath.GRENADE;
        case MeanOfDeath.PLASMA_SPLASH:
            return MeanOfDeath.PLASMA;
        case MeanOfDeath.ROCKET_SPLASH:
            return MeanOfDeath.ROCKET;
        default:
            return cause;
    }
}
