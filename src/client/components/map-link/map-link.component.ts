import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '../../store/store';
import { MapDto } from 'src/shared';

@Component({
    selector: 'app-map-link',
    templateUrl: './map-link.component.html',
    styleUrls: ['./map-link.component.scss']
})
export class MapLinkComponent implements OnInit {
    @Input()
    public name: string;

    public data$: Observable<MapDto | undefined>;

    constructor(private store: Store) {
    }

    public ngOnInit() {
        this.data$ = this.store.getMap$(this.name);
    }
}
