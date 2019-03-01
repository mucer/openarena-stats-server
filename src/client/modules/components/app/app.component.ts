import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActionType, ClientDto, PersonDto } from '@shared';
import { Observable } from 'rxjs';
import { Store } from '../../store/store';
import { setPreviousOrParentTNode } from '@angular/core/src/render3/state';

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
