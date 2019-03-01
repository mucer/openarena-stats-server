import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PersonDetailDto } from '@shared';
import { Observable } from 'rxjs';
import { Store } from '../../store/store';

@Component({
    selector: 'app-person',
    templateUrl: './person.component.html'
})
export class PersonComponent implements OnChanges {
    @Input()
    public id: string;

    public data$: Observable<PersonDetailDto | undefined>;

    constructor(private store: Store) {
    }

    public ngOnChanges(changes: SimpleChanges) {
        if ('id' in changes) {
            this.data$ = this.store.loadPersonDetail(this.id);
        }
    }
}