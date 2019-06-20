import { NgReduxModule } from '@angular-redux/store';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { DataService } from '../services/data.service';
import { Store } from './store';

@NgModule({
  imports: [
    NgReduxModule,
    HttpClientModule
  ],
  providers: [
    Store,
    DataService
  ]
})
export class StoreModule {
}
