import { Component } from '@angular/core';
import { Store } from '../../store/store';
import { PageEvent } from '@angular/material';
import { MapDto } from 'src/shared';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.scss']
})
export class MapsComponent {
    pageSize = 10;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    pageEvent: PageEvent;
    columns: string[] = ['name', 'times_played'];


    page$ = new BehaviorSubject<{ from: number, to: number }>({ from: 0, to: this.pageSize });

    visibleMaps$: Observable<MapDto[]> = combineLatest(this.store.maps$, this.page$)
        .pipe(map(data => data[0].slice(data[1].from, data[1].to)));

    constructor(public store: Store) {
        store.loadMaps();
    }

    setPage(page: PageEvent) {
        this.page$.next({
            from: page.pageIndex * page.pageSize,
            to: (page.pageIndex + 1) * page.pageSize
        });
    }
}