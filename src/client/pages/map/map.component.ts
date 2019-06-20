import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MapDto } from '../../../shared';
import { Store } from '../../store/store';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html'
})
export class MapComponent implements OnInit {
    public data$: Observable<MapDto | undefined> | undefined;

    constructor(private store: Store, private route: ActivatedRoute) {
    }

    public ngOnInit() {
        this.route.params.subscribe(params => {
            this.data$ = this.store.getMap$(params.name);
        });
    }
}
