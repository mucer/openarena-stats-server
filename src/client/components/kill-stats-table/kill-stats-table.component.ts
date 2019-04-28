import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { KillStatsDto, StatRestrictionsDto, assign } from '../../../shared';
import { Store } from '../../store/store';

@Component({
    selector: 'app-kill-stats-table',
    templateUrl: './kill-stats-table.component.html',
    styleUrls: ['./kill-stats-table.component.scss']
})
export class KillStatsTableComponent implements OnInit, OnChanges {
    @Input()
    restrictions: StatRestrictionsDto | undefined;

    @Input()
    hidePerson: number | number[] | undefined;

    @Input()
    columns: string[] = ['personName', 'killDeathRatio', 'kills', 'teamKills', 'deaths', 'teamDeaths', 'totalDeaths', 'duration'];

    stats$: Observable<KillStatsDto[]>;

    private hidePersons$ = new BehaviorSubject<number[]>([]);

    constructor(private store: Store) {
    }

    ngOnInit() {
        let stats$: Observable<KillStatsDto[]>;

        // special handling if from && to person id is the same. Will only show suicides if not splitted
        if (this.restrictions && this.restrictions.fromPersonId === this.restrictions.toPersonId) {
            stats$ = combineLatest(
                this.store.loadKillStats(assign(this.restrictions, { toPersonId: undefined })).pipe(filter(Boolean)),
                this.store.loadKillStats(assign(this.restrictions, { fromPersonId: undefined })).pipe(filter(Boolean))
            ).pipe(
                map(ary => {
                    const fromStats: KillStatsDto[] = ary[0];
                    const toStats: KillStatsDto[] = ary[1];

                    return toStats.map((to: KillStatsDto) => {
                        const from: KillStatsDto = fromStats.find(r => r.personId === to.personId);
                        return {
                            personId: from.personId,
                            personName: from.personName,
                            kills: to.kills,
                            teamKills: to.teamKills,
                            deaths: from.deaths,
                            teamDeaths: from.teamDeaths,
                            duration: Math.min(from.duration, to.duration)
                        } as KillStatsDto;
                    });
                })
            ) as Observable<KillStatsDto[]>
        } else {
            stats$ = this.store.loadKillStats(this.restrictions);
        }

        this.stats$ = combineLatest(stats$, this.hidePersons$).pipe(
            filter(ary => !!ary[0] && !!ary[1]),
            map(ary => {
                const stats: KillStatsDto[] = ary[0];
                const hidePersons: number[] = ary[1];
                return stats
                    .filter(r => hidePersons.indexOf(r.personId) === -1)
                    .map(r => this.calcStats(r))
                    .sort((a, b) => b.killDeathRatio - a.killDeathRatio)
            })
        );
    }

    ngOnChanges(changes: SimpleChanges) {
        if ('hidePerson' in changes) {
            let ids: number[];
            if (typeof this.hidePerson === 'number') {
                ids = [this.hidePerson];
            } else if (this.hidePerson) {
                ids = this.hidePerson;
            } else {
                ids = [];
            }
            this.hidePersons$.next(ids);
        }
    }

    private calcStats(row: KillStatsDto): ExtKillStatsDto {
        return Object.assign(row, {
            totalDeaths: row.deaths + row.teamDeaths,
            totalKills: row.kills + row.teamKills,
            killDeathRatio: row.kills / (row.deaths + row.teamDeaths) || 0
        });
    }
}

interface ExtKillStatsDto extends KillStatsDto {
    totalDeaths: number;
    totalKills: number;
    killDeathRatio: number;
}
