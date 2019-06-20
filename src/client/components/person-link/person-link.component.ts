import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PersonDto } from '../../../shared';
import { Store } from '../../store/store';

@Component({
    selector: 'app-person-link',
    templateUrl: './person-link.component.html',
    styleUrls: ['./person-link.component.scss']
})
export class PersonLinkComponent implements OnInit {
    @Input()
    public id: number;

    public data$: Observable<PersonDto | undefined>;

    constructor(private store: Store) {
    }

    public ngOnInit() {
        this.data$ = this.store.getPerson$(this.id);
    }
}
