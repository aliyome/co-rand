import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
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
  redirectUnauthorizedTo,
  redirectLoggedInTo,
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
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './store';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './app.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { StoreRouterConnectingModule, RouterState } from '@ngrx/router-store';
import { RoomEffects } from './store/room/room.effects';
import { AuthEffects } from './store/auth/auth.effects';
import { BeforeLoginOnlyGuard } from './guards/before-login-only.guard';

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
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {
        path: '',
        component: LoginComponent,
        ...redirectLoggedInTo(['room']),
        canActivate: [BeforeLoginOnlyGuard],
      },
      {
        path: 'room',
        component: RoomListComponent,
        ...redirectUnauthorizedTo(['/']),
        canActivate: [AngularFireAuthGuard],
        children: [
          {
            path: ':id',
            loadChildren: () =>
              import('./room/room.module').then(m => m.RoomModule),
            canActivate: [AngularFireAuthGuard],
          },
        ],
      },
    ]),
    LayoutModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    AngularFirestoreModule,
    AngularFireFunctionsModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        // strictStateSerializability: true,
        // strictActionSerializability: true,
      },
    }),
    EffectsModule.forRoot([AppEffects, RoomEffects, AuthEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    StoreRouterConnectingModule.forRoot({
      routerState: RouterState.Minimal,
    }),
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
