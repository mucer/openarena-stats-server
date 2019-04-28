import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatBadgeModule, MatCardModule, MatChipsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatTableModule, MatToolbarModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './components/app/app.component';
import { ClientComponent } from './components/client/client.component';
import { ClientsComponent } from './components/clients/clients.component';
import { KillStatsTableComponent } from './components/kill-stats-table/kill-stats-table.component';
import { MapsComponent } from './components/maps/maps.component';
import { PersonComponent } from './components/person/person.component';
import { PersonsComponent } from './components/persons/persons.component';
import { SimpleCardComponent } from './components/simple-card/simple-card.component';
import { DurationPipe } from './pipes/duration.pipe';
import { StoreModule } from './store/store.module';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/clients',
    pathMatch: 'full'
  },
  { path: 'clients', component: ClientsComponent },
  { path: 'persons', component: PersonsComponent },
  { path: 'person/:id', component: PersonComponent },
  { path: 'maps', component: MapsComponent }
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatChipsModule,
    MatBadgeModule,
    MatCardModule,
    MatPaginatorModule,
    StoreModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  declarations: [
    AppComponent,
    ClientsComponent,
    SimpleCardComponent,
    PersonsComponent,
    PersonComponent,
    ClientComponent,
    MapsComponent,
    KillStatsTableComponent,
    DurationPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
