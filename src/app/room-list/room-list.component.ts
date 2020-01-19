import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Room } from '../store/room/room.model';
import * as fromRoom from '../store/room/room.reducer';
import * as fromAuth from '../store/auth';
import { Store, select } from '@ngrx/store';
import { tap, filter } from 'rxjs/operators';

import * as root from '../store';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css'],
})
export class RoomListComponent implements OnInit {
  roomList$: Observable<Room[]>;

  private enterSecureRoom: ({
    roomId,
    pass,
  }: {
    roomId: number | string;
    pass: string;
  }) => Observable<boolean>;
  userName$: Observable<string | null | undefined>;

  constructor(
    public dialog: MatDialog,
    private readonly router: Router,
    private readonly afFunc: AngularFireFunctions,
    private readonly roomStore: Store<fromRoom.State>,
    private readonly authStore: Store<fromAuth.State>,
    private readonly snackbar: MatSnackBar,
  ) {
    this.roomList$ = roomStore.pipe(
      filter(x => !!x),
      select(fromRoom.selectAll),
    );

    this.userName$ = authStore.pipe(select(fromAuth.selectAuthName));

    // TODO: extract
    this.enterSecureRoom = this.afFunc.httpsCallable<
      { roomId: string; pass: string },
      boolean
    >('enterSecureRoom');
  }

  ngOnInit() {}

  async openDialog(roomListItem: Room): Promise<void> {
    if (roomListItem.password) {
      const dialogRef = this.dialog.open(RoomDialogComponent, {
        width: '250px',
        data: { name: 'hoge' },
      });

      const pass = await dialogRef.afterClosed().toPromise();
      if (!pass) {
        return;
      }

      const success = await this.enterSecureRoom({
        roomId: roomListItem.id,
        pass,
      }).toPromise();
      console.log(success);
      if (!success) {
        this.snackbar.open('パスワードが間違っています。', 'close', {
          duration: 3000,
        });
        return;
      }
    }

    this.router.navigate(['/', 'room', roomListItem.id]);
  }

  createRoom() {
    this.router.navigate(['/', 'create-room']);
  }
}

@Component({
  selector: 'app-room-dialog',
  template: `
    <h1 mat-dialog-title>パスワード入力</h1>
    <div mat-dialog-content>
      <mat-form-field>
        <input
          matInput
          type="password"
          [formControl]="pass"
          placeholder="password"
          aria-label="password"
        />
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">キャンセル</button>
      <button mat-button [mat-dialog-close]="pass.value" cdkFocusInitial>
        Ok
      </button>
    </div>
  `,
})
export class RoomDialogComponent implements OnInit {
  pass: FormControl;
  constructor(
    public dialogRef: MatDialogRef<RoomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.pass = new FormControl('', []);
  }

  ngOnInit() {}

  onNoClick() {
    this.dialogRef.close();
  }
}
