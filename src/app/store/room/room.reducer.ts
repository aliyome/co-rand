import {
  Action,
  createReducer,
  on,
  createSelector,
  createFeatureSelector,
} from '@ngrx/store';
import {
  EntityState,
  EntityAdapter,
  createEntityAdapter,
  Dictionary,
} from '@ngrx/entity';
import { Room } from './room.model';
import * as RoomActions from './room.actions';
import * as fromRoot from '../';

export const roomsFeatureKey = 'rooms';

export interface State extends EntityState<Room> {
  // additional entities state properties
  selectedId: string | null;
}

export const adapter: EntityAdapter<Room> = createEntityAdapter<Room>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  selectedId: null,
});

const roomReducer = createReducer(
  initialState,
  on(RoomActions.addRoom, (state, action) =>
    adapter.addOne(action.room, state),
  ),
  on(RoomActions.upsertRoom, (state, action) =>
    adapter.upsertOne(action.room, state),
  ),
  on(RoomActions.addRooms, (state, action) =>
    adapter.addMany(action.rooms, state),
  ),
  on(RoomActions.upsertRooms, (state, action) =>
    adapter.upsertMany(action.rooms, state),
  ),
  on(RoomActions.updateRoom, (state, action) =>
    adapter.updateOne(action.room, state),
  ),
  on(RoomActions.updateRooms, (state, action) =>
    adapter.updateMany(action.rooms, state),
  ),
  on(RoomActions.deleteRoom, (state, action) =>
    adapter.removeOne(action.id, state),
  ),
  on(RoomActions.deleteRooms, (state, action) =>
    adapter.removeMany(action.ids, state),
  ),
  on(RoomActions.loadRooms, (state, action) =>
    adapter.addAll(action.rooms, state),
  ),
  on(RoomActions.clearRooms, state => adapter.removeAll(state)),
);

export function reducer(state: State | undefined, action: Action) {
  return roomReducer(state, action);
}

export const selectRoomsState = createFeatureSelector<State>(roomsFeatureKey);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(selectRoomsState);

export const selectEntity = createSelector(
  selectEntities,
  (entities: Dictionary<Room>, props: { id: string }) => entities[props.id],
);
