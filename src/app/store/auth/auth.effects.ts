import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { catchError, map, switchMapTo, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as AuthActions from './auth.actions';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class AuthEffects {
  init$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      switchMapTo(
        this.afAuth.user.pipe(
          map(user =>
            AuthActions.upsertAuth({
              user: user ? { uid: user.uid } : null,
            }),
          ),
        ),
      ),
      catchError(error => of(AuthActions.throwAuthError({ error }))),
    );
  });

  signInAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signInAuth),
      switchMap(async () => {
        const credential = await this.afAuth.auth.signInAnonymously();
        return AuthActions.signInAuthSuccess({
          user: credential.user ? { uid: credential.user.uid } : null,
        });
      }),
      catchError(error => of(AuthActions.signInAuthFailure({ error }))),
    ),
  );

  signOut$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signOut),
        tap(() => this.afAuth.auth.signOut()),
        catchError(error => of(AuthActions.throwAuthError({ error }))),
      ),
    { dispatch: false },
  );

  constructor(private actions$: Actions, private afAuth: AngularFireAuth) {}
}
