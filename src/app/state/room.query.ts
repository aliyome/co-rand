import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { RoomStore, RoomState } from './room.store';

@Injectable({ providedIn: 'root' })
export class RoomQuery extends QueryEntity<RoomState> {
  constructor(protected store: RoomStore) {
    super(store);
  }
}
