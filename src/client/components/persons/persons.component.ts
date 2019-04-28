import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PersonDto } from '../../../shared';
import { Store } from '../../store/store';

@Component({
    templateUrl: './persons.component.html'
})
export class PersonsComponent {

    public persons$: Observable<PersonDto[] | undefined>;

    constructor(public store: Store) {
      store.loadPersons();
    }

}