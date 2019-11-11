import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PersonDto } from 'src/shared';
import { Store } from '../../store/store';
import { map } from 'rxjs/operators';

@Component({
    templateUrl: './persons-page.component.html',
    styleUrls: ['./persons-page.component.scss']
})
export class PersonsPageComponent {
  public persons$: Observable<PersonDto[] | undefined>;

    constructor(public store: Store) {
      this.persons$ = store.getPersons$()
        .pipe(map(persons => persons.sort((a, b) => a.name.localeCompare(b.name))));
    }

}
