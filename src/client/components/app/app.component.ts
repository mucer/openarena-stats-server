import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ClientDto, PersonDto } from '../../../shared';
import { Store } from '../../store/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public myControl = new FormControl();

  public persons$: Observable<PersonDto[] | undefined>;

  public clients$: Observable<ClientDto[] | undefined>;

  clientColumns: string[] = ['hw-id', 'person-name', 'names'];

  constructor(public store: Store) {
    store.loadPersons();
    store.loadClients();
  }
}
