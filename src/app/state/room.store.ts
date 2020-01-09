import { Injectable } from '@angular/core';
import { Room } from './room.model';
import {
  EntityState,
  ActiveState,
  EntityStore,
  StoreConfig,
} from '@datorama/akita';

export interface RoomState
  extends EntityState<Room, string>,
    ActiveState<string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'room' })
export class RoomStore extends EntityStore<RoomState> {
  constructor() {
    super();
  }
}
