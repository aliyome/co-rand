import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import {
  catchError,
  map,
  concatMap,
  tap,
  switchMap,
  switchMapTo,
  repeat,
  mapTo,
  finalize,
} from 'rxjs/operators';
import { EMPTY, of, Observable } from 'rxjs';

import * as RoomActions from './room.actions';
import { Room } from './room.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class RoomEffects {
  private hoge: any;

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      mapTo(RoomActions.syncRooms()),
    ),
  );

  sync$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoomActions.syncRooms),
      switchMap(() => {
        console.log('sync');
        return this.afStore
          .collection<Room>('rooms')
          .valueChanges()
          .pipe(
            tap(console.log),
            map(rooms => RoomActions.upsertRooms({ rooms })),
            catchError(error => of(RoomActions.throwRoomError({ error }))),
          );
      }),
    ),
  );

  constructor(private actions$: Actions, private afStore: AngularFirestore) {}
}
