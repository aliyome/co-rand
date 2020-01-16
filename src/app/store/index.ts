import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
} from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { environment } from '../../environments/environment';

import * as fromRoom from '../store/room/room.reducer';
import * as fromAuth from '../store/auth/auth.reducer';

export interface State {
  router: RouterReducerState;
  rooms: fromRoom.State;
  auth: fromAuth.State;
}

export const reducers: ActionReducerMap<State> = {
  router: routerReducer,
  rooms: fromRoom.reducer,
  auth: fromAuth.reducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? []
  : [];
