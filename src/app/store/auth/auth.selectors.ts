import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuth from './auth.reducer';

export const selectAuthState = createFeatureSelector<fromAuth.State>(
  fromAuth.authFeatureKey,
);

export const selectAuthUid = createSelector(
  selectAuthState,
  (state: fromAuth.State) => (state.user ? state.user.uid : null),
);

export const selectAuthIsLoading = createSelector(
  selectAuthState,
  (state: fromAuth.State) => state.isLoading,
);

export const selectAuthName = createSelector(
  selectAuthState,
  (state: fromAuth.State) => (state.user ? state.user.name : null),
);

export const selectAuthIsInitialized = createSelector(
  selectAuthState,
  (state: fromAuth.State) => state.isInitialized,
);
