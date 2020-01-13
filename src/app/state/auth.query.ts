import { Injectable } from '@angular/core';
import { Query, StoreConfig } from '@datorama/akita';
import { AuthStore, AuthState } from './auth.store';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'auth' })
export class AuthQuery extends Query<AuthState> {
  constructor(protected store: AuthStore) {
    super(store);
  }
}
