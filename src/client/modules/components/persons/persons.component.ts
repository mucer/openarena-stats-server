import { Component } from '@angular/core';
import { PersonDto } from '@shared';
import { Observable } from 'rxjs';
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