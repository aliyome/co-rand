import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css'],
})
export class RoomListComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  openDialog(): void {
    const dialogRef = this.dialog.open(RoomDialogComponent, {
      width: '250px',
      data: { name: 'hoge' },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
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
