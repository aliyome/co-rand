import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import {
  catchError,
  map,
  switchMapTo,
  switchMap,
  tap,
  first,
  mapTo,
  filter,
  mergeMap,
  mergeMapTo,
  concatMapTo,
} from 'rxjs/operators';
import { of, merge, concat } from 'rxjs';

import * as AuthActions from './auth.actions';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthUser } from './auth.model';
import { Store, select } from '@ngrx/store';
import * as fromAuth from './auth.reducer';
import * as fromRoom from '../room';
import * as AuthSelectors from './auth.selectors';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  init$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      switchMapTo(
        merge(
          this.afAuth.user.pipe(
            map(user =>
              AuthActions.upsertAuth({
                user: user ? { uid: user.uid } : null,
              }),
            ),
          ),
          of(AuthActions.syncAuth()),
        ),
      ),
      catchError(error => of(AuthActions.throwAuthError({ error }))),
    );
  });

  sync$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.syncAuth),
      switchMapTo(
        this.authStore.pipe(
          select(AuthSelectors.selectAuthUid),
          filter(uid => !!uid),
        ),
      ),
      switchMap(uid =>
        this.afStore
          .doc<AuthUser>(`users/${uid}`)
          .valueChanges()
          .pipe(
            filter(user => !!user),
            map(user => AuthActions.upsertAuth({ user: user as AuthUser })),
            catchError(error => of(AuthActions.throwAuthError({ error }))),
          ),
      ),
    ),
  );

  signInAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signInAuth),
      switchMap(async ({ name }) => {
        const credential = await this.afAuth.auth.signInAnonymously();
        if (!credential.user) {
          return AuthActions.signInAuthFailure({ error: '匿名ログイン失敗' });
        }
        const uid = credential.user.uid;

        // TODO: Make Store<User>
        const doc = this.afStore.doc<AuthUser>(`users/${uid}`);
        await doc.set({ uid, name });

        const user = await this.afStore
          .doc<AuthUser>(`users/${uid}`)
          .valueChanges()
          .pipe(first())
          .toPromise();
        return AuthActions.signInAuthSuccess({ user: user ? user : null });
      }),
      catchError(error => of(AuthActions.signInAuthFailure({ error }))),
    ),
  );

  signInAuthSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signInAuthSuccess),
      mapTo(fromRoom.syncRooms()),
      tap(() => {
        // navigate to roomlist
        this.router.navigate(['/', 'room']);
      }),
    ),
  );

  signOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signOutAuth),
      tap(async () => {
        const uid = await this.authStore
          .pipe(first(), select(AuthSelectors.selectAuthUid))
          .toPromise();
        // TODO: Make Store<User>
        console.log(uid);
        if (uid) {
          const doc = this.afStore.doc<AuthUser>(`users/${uid}`);
          await doc.delete();
          await this.afAuth.auth.signOut();
          console.log('foo');
        }
      }),
      mapTo(AuthActions.signOutAuthSuccess()),
    ),
  );

  signOutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signOutAuthSuccess),
        tap(console.warn),
        tap(() => {
          this.router.navigate(['/']);
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private authStore: Store<fromAuth.State>,
    private roomStore: Store<fromRoom.State>,
    private router: Router,
  ) {}
}
