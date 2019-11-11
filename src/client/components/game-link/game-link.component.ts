import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GameDto } from '../../../shared';
import { Store } from '../../store/store';

@Component({
    selector: 'app-game-link',
    templateUrl: './game-link.component.html',
    styleUrls: ['./game-link.component.scss']
})
export class GameLinkComponent implements OnInit {
    @Input()
    public id: number;

    public data$: Observable<GameDto | undefined>;

    constructor(private store: Store) {
    }

    public ngOnInit() {
        this.data$ = this.store.getGame$(this.id);
    }
}
