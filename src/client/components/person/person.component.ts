import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PersonDetailDto } from '../../../shared';
import { Store } from '../../store/store';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-person',
    templateUrl: './person.component.html'
})
export class PersonComponent implements OnInit {
    public data$: Observable<PersonDetailDto | undefined>;

    constructor(private store: Store, private route: ActivatedRoute) {
    }

    public ngOnInit() {
        this.route.params.subscribe(params => {
            this.data$ = this.store.loadPersonDetail(params.id);
        });
    }
}