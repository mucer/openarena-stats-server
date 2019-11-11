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
import { ClientsPageComponent } from './pages/clients/clients-page.component';
import { MapPageComponent } from './pages/map/map-page.component';
import { MapsPageComponent } from './pages/maps/maps-page.component';
import { PersonPageComponent } from './pages/person/person-page.component';
import { PersonsPageComponent } from './pages/persons/persons-page.component';
import { DurationPipe } from './pipes/duration.pipe';
import { StoreModule } from './store/store.module';
import { StartPageComponent } from './pages/start/start-page.compenent';
import { GameLinkComponent } from './components/game-link/game-link.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { GameTypePipe } from './pipes/game-type.pipe';
import { AmChartsComponent } from './components/am-charts/am-charts.component';

const appRoutes: Routes = [
  {
    path: '',
    component: StartPageComponent,
    pathMatch: 'full'
  },
  { path: 'clients', component: ClientsPageComponent },
  { path: 'persons', component: PersonsPageComponent },
  { path: 'person/:id', component: PersonPageComponent },
  { path: 'maps', component: MapsPageComponent },
  { path: 'map/:name', component: MapPageComponent }
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
    ClientsPageComponent,
    SimpleCardComponent,
    PersonsPageComponent,
    PersonPageComponent,
    ClientComponent,
    MapsPageComponent,
    MapPageComponent,
    KillStatsTableComponent,
    PersonLinkComponent,
    GameLinkComponent,
    MapLinkComponent,
    DurationPipe,
    GameTypePipe,
    LoadingComponent,
    StartPageComponent,
    LineChartComponent,
    AmChartsComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
