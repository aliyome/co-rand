import { Action, createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthUser } from './auth.model';

export const authFeatureKey = 'auth';

export interface State {
  user: AuthUser | null;
  isLoading: boolean;
  error?: any;
}

export const initialState: State = {
  user: null,
  isLoading: false,
};

const authReducer = createReducer(
  initialState,

  on(AuthActions.upsertAuth, (state, action) => ({
    ...state,
    user: action.user,
  })),
  on(AuthActions.signInAuth, state => ({ ...state, isLoading: true })),
  on(AuthActions.signInAuthSuccess, (state, action) => ({
    ...state,
    user: action.user,
    isLoading: false,
  })),
  on(AuthActions.signInAuthFailure, (state, action) => ({
    ...state,
    error: action.error,
    isLoading: false,
  })),
  on(AuthActions.signOut, state => ({ user: null, isLoading: false })),
);

export function reducer(state: State | undefined, action: Action) {
  return authReducer(state, action);
}
