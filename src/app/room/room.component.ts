import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, tap, filter, share, shareReplay, publish } from 'rxjs/operators';
import { Room, History } from '../store/room/room.model';
import * as fromRoom from '../store/room/room.reducer';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit {
  room$: Observable<Room | undefined>;
  history$: Observable<History[]>;
  latest$: Observable<History>;

  displayedColumns = ['name', 'value', 'updatedAt'];

  current: number;
  private roomId: string;
  private runRouletteFunc: (uid: string) => Observable<number>;

  constructor(
    private readonly afFunc: AngularFireFunctions,
    private readonly afStore: AngularFirestore,
    private readonly route: ActivatedRoute,
    private readonly roomStore: Store<fromRoom.State>,
  ) {
    this.runRouletteFunc = afFunc.httpsCallable<string, number>('runRoulette');
    this.route.paramMap.subscribe(x => {
      const roomId = x.get('id');
      if (!roomId) {
        return;
      }
      this.roomId = roomId;
      this.room$ = roomStore.pipe(
        select(fromRoom.selectEntity, { id: roomId }),
        shareReplay(1),
      );
      this.history$ = this.room$.pipe(
        filter(r => !!r),
        map((r: Room) => {
          const dup = [...r.history];
          dup.sort((a: History, b: History) => {
            if (!a.updatedAt || !b.updatedAt) {
              return -1;
            } else if (a.updatedAt > b.updatedAt) {
              return -1;
            } else if (a.updatedAt < b.updatedAt) {
              return 1;
            } else {
              return 0;
            }
          });
          return dup;
        }),
        shareReplay(1),
      );
      this.latest$ = this.history$.pipe(map(r => r[0]));
    });
  }

  ngOnInit() {}

  async runRoulette() {
    // HACK: 最新の値を表示するだけで十分なのでcurrentは不要かも
    this.current = await this.runRouletteFunc(this.roomId).toPromise();
  }
}
