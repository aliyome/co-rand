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

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css'],
})
export class RoomListComponent implements OnInit {
  roomList$: Observable<RoomListItem[]>;

  constructor(
    public dialog: MatDialog,
    private readonly afStore: AngularFirestore,
    private readonly router: Router,
  ) {
    this.roomList$ = afStore
      .collection<RoomListItem>(`room-list`)
      .valueChanges();
  }

  ngOnInit() {}

  async openDialog(roomListItem: RoomListItem): Promise<void> {
    if (roomListItem.password) {
      const dialogRef = this.dialog.open(RoomDialogComponent, {
        width: '250px',
        data: { name: 'hoge' },
      });

      const result = await dialogRef.afterClosed().toPromise();
      console.log(result);
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
