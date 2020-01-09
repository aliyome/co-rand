import { Injectable } from '@angular/core';
import { RoomStore, RoomState } from './room.store';
import { CollectionConfig, CollectionService } from 'akita-ng-fire';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'rooms' })
export class RoomService extends CollectionService<RoomState> {
  constructor(store: RoomStore) {
    super(store);
  }
}
