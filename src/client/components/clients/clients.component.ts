import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '../../store/store';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent {
  public myControl = new FormControl();

  clientColumns: string[] = ['hw-id', 'person-name', 'names'];

  constructor(public store: Store) {
    store.loadClients();
  }
}
