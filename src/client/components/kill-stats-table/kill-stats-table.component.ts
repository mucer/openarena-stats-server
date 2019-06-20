import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { round } from 'lodash';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { assign, KillStatsDto, KillStatsRestrictionsDto } from '../../../shared';
import { Store } from '../../store/store';
import { Sort } from '@angular/material';

@Component({
    selector: 'app-kill-stats-table',
    templateUrl: './kill-stats-table.component.html',
    styleUrls: ['./kill-stats-table.component.scss']
})
export class KillStatsTableComponent implements OnChanges {
    @Input()
    restrictions: KillStatsRestrictionsDto | undefined;

    @Input()
    hidePerson: number | number[] | undefined;

    @Input()
    columns: string[] = ['personName', 'killDeathRatio', 'kills', 'teamKills', 'deaths', 'teamDeaths', 'totalDeaths', 'duration'];

    stats$: Observable<KillStatsDto[]>;

    private sort$ = new BehaviorSubject<Sort | undefined>(undefined);

    private hidePersons$ = new BehaviorSubject<number[]>([]);

    constructor(private store: Store) {
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

        if ('restrictions' in changes) {
            this.updateStats();
        }
    }

    sortData(sort: Sort) {
        this.sort$.next(sort.active && sort.direction ? sort : undefined);
    }

    private updateStats() {
        let allStats$: Observable<KillStatsDto[]>;

        const personalStats = this.restrictions.fromPersonId === this.restrictions.toPersonId;

        // special handling if from && to person id is the same. Will only show suicides if not splitted
        if (this.restrictions && personalStats) {
            allStats$ = combineLatest(
                this.store.getKillStats$(assign(this.restrictions, { toPersonId: undefined })).pipe(filter(Boolean)),
                this.store.getKillStats$(assign(this.restrictions, { fromPersonId: undefined })).pipe(filter(Boolean))
            ).pipe(
                map(ary => {
                    const fromStats = ary[0] as KillStatsDto[];
                    const toStats = ary[1] as KillStatsDto[];

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
            ) as Observable<KillStatsDto[]>;
        } else {
            allStats$ = this.store.getKillStats$(this.restrictions);
        }

        this.stats$ = combineLatest(allStats$, this.hidePersons$, this.sort$).pipe(
            filter(ary => !!ary[0] && !!ary[1]),
            map(ary => {
                const stats: KillStatsDto[] = ary[0];
                const hidePersons: number[] = ary[1];
                const sort: Sort | undefined = ary[2];
                return stats
                    .filter(r => hidePersons.indexOf(r.personId) === -1)
                    .map(r => this.calcStats(r, personalStats))
                    .sort(this.getCompareFunction(sort));
            })
        );
    }

    private getCompareFunction(sort: Sort | undefined) {
        const isDesc: boolean = !sort || sort.direction === 'desc';
        const col: string = sort && sort.active || 'killDeathRatio';

        return isDesc
            ? (a: any, b: any) => (a[col] < b[col] ? 1 : -1)
            : (a: any, b: any) => (a[col] < b[col] ? -1 : 1);
    }

    private calcStats(row: KillStatsDto, personalStats: boolean): ExtKillStatsDto {
        const kdDeaths = personalStats ? row.deaths : row.deaths + row.teamDeaths;

        return Object.assign(row, {
            totalDeaths: row.deaths + row.teamDeaths,
            totalKills: row.kills + row.teamKills,
            killDeathRatio: row.kills > 0 && row.deaths === 0 ? Infinity : round(row.kills / kdDeaths || 0, 2)
        });
    }
}

interface ExtKillStatsDto extends KillStatsDto {
    totalDeaths: number;
    totalKills: number;
    killDeathRatio: number;
}
