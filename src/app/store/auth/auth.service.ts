import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import * as fromAuth from './auth.reducer';
import * as authActions from './auth.actions';
import * as authSelectors from './auth.selectors';
import { AuthUser } from './auth.model';
import { Observable } from 'rxjs';
import { skipUntil, filter, switchMap, switchMapTo, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly authStore: Store<fromAuth.State>) {}

  signIn(): Observable<string | null> {
    this.authStore.dispatch(authActions.signInAuth());
    const isLoading$ = this.authStore.select(authSelectors.selectAuthIsLoading);
    const uid$ = this.authStore.select(authSelectors.selectAuthUid);
    return uid$.pipe(skipUntil(isLoading$.pipe(filter(x => !x))));
  }
}
