import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatButtonModule,
  MatCardModule,
  MatChipsModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { KillStatsTableComponent } from './components/kill-stats-table/kill-stats-table.component';
import { LoadingComponent } from './components/loading/loading.component';
import { MapLinkComponent } from './components/map-link/map-link.component';
import { PersonLinkComponent } from './components/person-link/person-link.component';
import { SimpleCardComponent } from './components/simple-card/simple-card.component';
import { AppComponent } from './pages/app/app.component';
import { ClientComponent } from './pages/client/client.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { MapComponent } from './pages/map/map.component';
import { MapsComponent } from './pages/maps/maps.component';
import { PersonComponent } from './pages/person/person.component';
import { PersonsComponent } from './pages/persons/persons.component';
import { DurationPipe } from './pipes/duration.pipe';
import { StoreModule } from './store/store.module';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/persons',
    pathMatch: 'full'
  },
  { path: 'clients', component: ClientsComponent },
  { path: 'persons', component: PersonsComponent },
  { path: 'person/:id', component: PersonComponent },
  { path: 'maps', component: MapsComponent },
  { path: 'map/:name', component: MapComponent }
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
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatChipsModule,
    MatBadgeModule,
    MatCardModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatMenuModule,
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
    MapComponent,
    KillStatsTableComponent,
    PersonLinkComponent,
    MapLinkComponent,
    DurationPipe,
    LoadingComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
