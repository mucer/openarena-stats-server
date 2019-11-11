import { Component } from '@angular/core';
import { Store } from '../../store/store';
import { PageEvent } from '@angular/material';
import { MapDto } from 'src/shared';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    templateUrl: './maps-page.component.html',
    styleUrls: ['./maps-page.component.scss']
})
export class MapsPageComponent {
    public pageSize = 10;
    public pageSizeOptions: number[] = [5, 10, 25, 100];
    public pageEvent: PageEvent;
    public columns: string[] = ['name', 'times_played', 'duration'];

    public page$ = new BehaviorSubject<{ from: number, to: number }>({ from: 0, to: this.pageSize });

    public maps$: Observable<MapDto[] | undefined>;

    public visibleMaps$: Observable<MapDto[]> = combineLatest(this.store.maps$, this.page$)
        .pipe(map(data => data[0].slice(data[1].from, data[1].to)));

    constructor(public store: Store) {
        this.maps$ = store.getMaps$();
    }

    setPage(page: PageEvent) {
        this.page$.next({
            from: page.pageIndex * page.pageSize,
            to: (page.pageIndex + 1) * page.pageSize
        });
    }
}
