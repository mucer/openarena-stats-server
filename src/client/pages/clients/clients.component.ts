import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ClientDto, PersonDto } from 'src/shared';
import { Store } from '../../store/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent {
  public myControl = new FormControl();

  public clients$: Observable<ClientDto[] | undefined>;

  public personNames$: Observable<string[] | undefined>;

  clientColumns: string[] = ['hw-id', 'person-name', 'names'];

  constructor(private store: Store) {
    this.clients$ = store.getClients$();
    this.personNames$ = store.getPersons$().pipe(map(ary => ary && ary.map(p => p.name).sort()));
  }

  public assignPerson(client: ClientDto, personName: string) {
    this.store.assignPerson(client, personName);
  }
}
