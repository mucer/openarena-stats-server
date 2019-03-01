import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { ClientDto } from '@shared';
import { Observable } from 'rxjs';
import { Store } from '../../store/store';

@Component({
    selector: 'app-client',
    template: 'CLIENT {{ id }}'
})
export class ClientComponent implements OnChanges {
    @Input()
    public id: number;

    public data$: Observable<ClientDto>;

    constructor(private store: Store) {
    }

    public ngOnChanges(changes: SimpleChanges) {
        if ('id' in changes) {
            // this.store.dispatch({ type: ActionType.LOAD_PERSON, payload: this.id });
            // this.data$ = this.store.select(`personDetail`).pipe(map(d => d[this.id]), distinctUntilChanged());
        }
    }
}