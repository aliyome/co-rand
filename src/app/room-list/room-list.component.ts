import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { RoomListItem } from '../types/room';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css'],
})
export class RoomListComponent implements OnInit {
  roomList$: Observable<RoomListItem[]>;

  private enterSecureRoom: ({
    roomId,
    pass,
  }: {
    roomId: string;
    pass: string;
  }) => Observable<boolean>;

  constructor(
    public dialog: MatDialog,
    private readonly afStore: AngularFirestore,
    private readonly router: Router,
    private readonly afFunc: AngularFireFunctions,
    private readonly snackbar: MatSnackBar,
  ) {
    this.roomList$ = afStore.collection<RoomListItem>(`rooms`).valueChanges();

    this.enterSecureRoom = this.afFunc.httpsCallable<
      { roomId: string; pass: string },
      boolean
    >('enterSecureRoom');
  }

  ngOnInit() {}

  async openDialog(roomListItem: RoomListItem): Promise<void> {
    if (roomListItem.password) {
      const dialogRef = this.dialog.open(RoomDialogComponent, {
        width: '250px',
        data: { name: 'hoge' },
      });

      const pass = await dialogRef.afterClosed().toPromise();
      console.log(pass);
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
