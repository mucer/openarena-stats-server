import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatBadgeModule, MatCardModule, MatChipsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatTableModule, MatToolbarModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './components/app/app.component';
import { ClientsComponent } from './components/clients/clients.component';
import { StoreModule } from './store/store.module';
import { SimpleCardComponent } from './components/simple-card/simple-card.component';
import { PersonsComponent } from './components/persons/persons.component';
import { PersonComponent } from './components/person/person.component';
import { ClientComponent } from './components/client/client.component';

const appRoutes: Routes = [
  { path: '',
    redirectTo: '/clients',
    pathMatch: 'full'
  },
  { path: 'clients', component: ClientsComponent },
  { path: 'persons', component: PersonsComponent }
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
    ClientComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
