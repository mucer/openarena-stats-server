import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { round } from 'lodash';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { assign, KillStatsDto, KillStatsRestrictions } from '../../../shared';
import { Store } from '../../store/store';
import { Sort } from '@angular/material';

@Component({
  selector: 'app-kill-stats-table',
  templateUrl: './kill-stats-table.component.html',
  styleUrls: ['./kill-stats-table.component.scss']
})
export class KillStatsTableComponent implements OnChanges, OnInit {
  @Input()
  restrictions: KillStatsRestrictions | undefined;

  @Input()
  hideWorld = false;

  @Input()
  columns: string[] = ['personName', 'killDeathRatio', 'kills', 'teamKills', 'deaths', 'teamDeaths', 'totalDeaths', 'duration'];

  stats$: Observable<KillStatsDto[]>;

  private sort$ = new BehaviorSubject<Sort | undefined>(undefined);

  constructor(private store: Store) {}

  ngOnChanges(changes: SimpleChanges) {
    if ('restrictions' in changes) {
      this.updateStats();
    }
  }

  ngOnInit() {
    if (!this.restrictions) {
      this.updateStats();
    }
  }

  sortData(sort: Sort) {
    this.sort$.next(sort.active && sort.direction ? sort : undefined);
  }

  private updateStats() {
    let allStats$: Observable<KillStatsDto[]>;

    const personalStats = !!this.restrictions && this.restrictions.fromPersonId === this.restrictions.toPersonId;

    // special handling if from && to person id is the same. Will only show suicides if not splitted
    if (this.restrictions && personalStats) {
      allStats$ = combineLatest(
        this.store.getKillStats$(assign(this.restrictions, { toPersonId: undefined })).pipe(filter(Boolean)),
        this.store.getKillStats$(assign(this.restrictions, { fromPersonId: undefined })).pipe(filter(Boolean))
      ).pipe(
        map(ary => {
          const fromStats = ary[0] as KillStatsDto[];
          const toStats = ary[1] as KillStatsDto[];

          const stats: KillStatsDto[] = [];
          [...fromStats, ...toStats].forEach(s => {
            if (stats.every(s2 => s2.personId !== s.personId)) {
              stats.push({ personId: s.personId, personName: s.personName, kills: 0, teamKills: 0, deaths: 0, teamDeaths: 0, duration: 0 });
            }
          });

          stats.forEach((s: KillStatsDto) => {
            const to = toStats.find(r => r.personId === s.personId);
            const from = fromStats.find(r => r.personId === s.personId);
            if (to) {
              s.kills = to.kills;
              s.teamKills = to.teamKills;
              s.duration = to.duration;
            }
            if (from) {
              s.deaths = from.deaths;
              s.teamDeaths = from.teamDeaths;
              if (!s.duration || s.duration > from.duration) {
                s.duration = from.duration;
              }
            }
          });
          return stats;
        })
      ) as Observable<KillStatsDto[]>;
    } else {
      allStats$ = this.store.getKillStats$(this.restrictions);
    }

    this.stats$ = combineLatest(allStats$, this.sort$).pipe(
      filter(ary => !!ary[0]),
      map(ary => {
        const stats: KillStatsDto[] = ary[0];
        const sort: Sort | undefined = ary[1];
        return stats
          .filter(r => !this.hideWorld || r.personId !== 1)
          .map(r => this.calcStats(r, personalStats))
          .sort(this.getCompareFunction(sort));
      })
    );
  }

  private getCompareFunction(sort: Sort | undefined) {
    const isDesc: boolean = !sort || sort.direction === 'desc';
    const col: string = (sort && sort.active) || 'killDeathRatio';

    return isDesc ? (a: any, b: any) => (a[col] < b[col] ? 1 : -1) : (a: any, b: any) => (a[col] < b[col] ? -1 : 1);
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
