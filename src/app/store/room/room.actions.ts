import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Room } from './room.model';

export const loadRooms = createAction(
  '[Room/API] Load Rooms',
  props<{ rooms: Room[] }>(),
);

export const addRoom = createAction(
  '[Room/API] Add Room',
  props<{ room: Room }>(),
);

export const upsertRoom = createAction(
  '[Room/API] Upsert Room',
  props<{ room: Room }>(),
);

export const addRooms = createAction(
  '[Room/API] Add Rooms',
  props<{ rooms: Room[] }>(),
);

export const upsertRooms = createAction(
  '[Room/API] Upsert Rooms',
  props<{ rooms: Room[] }>(),
);

export const updateRoom = createAction(
  '[Room/API] Update Room',
  props<{ room: Update<Room> }>(),
);

export const updateRooms = createAction(
  '[Room/API] Update Rooms',
  props<{ rooms: Update<Room>[] }>(),
);

export const deleteRoom = createAction(
  '[Room/API] Delete Room',
  props<{ id: string }>(),
);

export const deleteRooms = createAction(
  '[Room/API] Delete Rooms',
  props<{ ids: string[] }>(),
);

export const clearRooms = createAction('[Room/API] Clear Rooms');

export const throwRoomError = createAction(
  '[Room] Throw Room Error',
  props<{ error: any }>(),
);
