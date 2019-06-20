import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PersonDto } from 'src/shared';
import { Store } from '../../store/store';
import { map } from 'rxjs/operators';

@Component({
    templateUrl: './persons.component.html',
    styleUrls: ['./persons.component.scss']
})
export class PersonsComponent {
  public persons$: Observable<PersonDto[] | undefined>;

    constructor(public store: Store) {
      this.persons$ = store.getPersons$()
        .pipe(map(persons => persons.sort((a, b) => a.name.localeCompare(b.name))));
    }

}
