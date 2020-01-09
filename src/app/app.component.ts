import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { RoomService } from './state/room.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    private readonly afAuth: AngularFireAuth,
    private readonly room: RoomService,
  ) {
    room.syncCollection().subscribe();
  }
}
