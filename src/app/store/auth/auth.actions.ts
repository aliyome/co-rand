import { createAction, props } from '@ngrx/store';
import { AuthUser } from './auth.model';

export const upsertAuth = createAction(
  '[Auth] Upsert Auth',
  props<{ user: AuthUser | null }>(),
);

export const signInAuth = createAction(
  '[Auth/API] SignIn Auth',
  props<{ name: string }>(),
);

export const throwAuthError = createAction(
  '[Auth] Throw Auth Error',
  props<{ error: any }>(),
);

export const signInAuthSuccess = createAction(
  '[Auth/API] SignIn Auth Success',
  props<{ user: AuthUser | null }>(),
);

export const signInAuthFailure = createAction(
  '[Auth/API] SignIn Auth Failure',
  props<{ error: any }>(),
);

export const signOutAuth = createAction('[Auth/API] SignOut Auth');
export const signOutAuthSuccess = createAction(
  '[Auth/API] SignOut Auth Success',
);

export const signOutAuthFailure = createAction(
  '[Auth/API] SignOut Auth Failure',
  props<{ error: any }>(),
);

export const syncAuth = createAction('[Auth/API] Sync Auth');
