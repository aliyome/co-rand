import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';

export interface HistoryItem {
  no: number;
  name: string;
  value: number;
}

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit {
  history: HistoryItem[] = [
    { no: 1, name: 'aaa', value: 10 },
    { no: 2, name: 'bbb', value: 20 },
    { no: 3, name: 'cc', value: 30 },
    { no: 4, name: 'ddd', value: 40 },
    { no: 5, name: 'eeeeee', value: 50 },
  ];

  displayedColumns = ['no', 'name', 'value'];

  current: number;
  private roomId: string;
  private runRouletteFunc: (uid: string) => Observable<number>;

  constructor(
    private readonly afFunc: AngularFireFunctions,
    private readonly afAuth: AngularFireAuth,
    private readonly route: ActivatedRoute,
  ) {
    this.runRouletteFunc = afFunc.httpsCallable<string, number>('runRoulette');
    this.route.paramMap.subscribe(x => {
      const roomId = x.get('id');
      if (!roomId) {
        return;
      }
      this.roomId = roomId;
    });
  }

  ngOnInit() {}

  async runRoulette() {
    // HACK: 最新の値を表示するだけで十分なのでcurrentは不要かも
    this.current = await this.runRouletteFunc(this.roomId).toPromise();
  }
}
