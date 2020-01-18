import { createFeatureSelector } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

export type State = fromRouter.RouterReducerState;

export const routerStoreKey = 'router';

export const selectRouter = createFeatureSelector<State>(routerStoreKey);

export const {
  selectCurrentRoute,
  selectQueryParam,
  selectQueryParams,
  selectRouteData,
  selectRouteParam,
  selectRouteParams,
  selectUrl,
} = fromRouter.getSelectors(selectRouter);

export const routerRequestAction = fromRouter.routerRequestAction;
export const routerNavigatedAction = fromRouter.routerNavigatedAction;
export const routerNavigationAction = fromRouter.routerNavigationAction;
