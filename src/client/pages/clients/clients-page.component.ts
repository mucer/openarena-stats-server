import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClientDto } from 'src/shared';
import { Store } from '../../store/store';

@Component({
  selector: 'app-clients',
  templateUrl: './clients-page.component.html',
  styleUrls: ['./clients-page.component.scss']
})
export class ClientsPageComponent {
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

  public refreshMaterializedViews(): void {
    this.store.refreshMaterializedViews();
  }
}
