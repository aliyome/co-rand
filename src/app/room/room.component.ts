import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Room, History } from '../types/room';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit {
  room$: Observable<Room | undefined>;
  history$: Observable<History[] | undefined>;
  latest$: Observable<History | undefined>;

  displayedColumns = ['name', 'value', 'updatedAt'];

  current: number;
  private roomId: string;
  private runRouletteFunc: (uid: string) => Observable<number>;

  constructor(
    private readonly afFunc: AngularFireFunctions,
    private readonly afAuth: AngularFireAuth,
    private readonly afStore: AngularFirestore,
    private readonly route: ActivatedRoute,
  ) {
    this.runRouletteFunc = afFunc.httpsCallable<string, number>('runRoulette');
    this.route.paramMap.subscribe(x => {
      const roomId = x.get('id');
      if (!roomId) {
        return;
      }
      this.roomId = roomId;
      this.room$ = afStore.doc<Room>(`rooms/${roomId}`).valueChanges();
      this.history$ = this.room$.pipe(
        map(r => (!!r ? r.history : [])),
        map(h =>
          h.sort((a, b) => {
            if (!a.updatedAt || !b.updatedAt) {
              return -1;
            } else if (a.updatedAt > b.updatedAt) {
              return -1;
            } else if (a.updatedAt < b.updatedAt) {
              return 1;
            } else {
              return 0;
            }
          }),
        ),
      );
      this.latest$ = this.history$.pipe(map(r => (!!r ? r[0] : undefined)));
    });
  }

  ngOnInit() {}

  async runRoulette() {
    // HACK: 最新の値を表示するだけで十分なのでcurrentは不要かも
    this.current = await this.runRouletteFunc(this.roomId).toPromise();
  }
}
