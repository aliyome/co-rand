import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import {
  AngularFireAuthGuardModule,
  AngularFireAuthGuard,
} from '@angular/fire/auth-guard';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import {
  AngularFireFunctionsModule,
  FUNCTIONS_REGION,
} from '@angular/fire/functions';

import { MaterialModule } from './material.module';

import { LoginComponent } from './login/login.component';
import {
  RoomListComponent,
  RoomDialogComponent,
} from './room-list/room-list.component';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './app.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LoginComponent,
    RoomListComponent,
    RoomDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: RoomListComponent },
      {
        path: 'room/:id',
        loadChildren: () =>
          import('./room/room.module').then(m => m.RoomModule),
        canActivate: [AngularFireAuthGuard],
      },
    ]),
    LayoutModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    AngularFirestoreModule,
    AngularFireFunctionsModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    AkitaNgRouterStoreModule.forRoot(),
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: !environment.production,
        strictActionSerializability: !environment.production,
      },
    }),
    EffectsModule.forRoot([AppEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    StoreRouterConnectingModule.forRoot(),
  ],
  providers: [
    {
      provide: FUNCTIONS_REGION,
      useValue: 'asia-northeast1',
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
