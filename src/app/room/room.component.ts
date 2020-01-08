import { Component, OnInit } from '@angular/core';

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

  constructor() {}

  ngOnInit() {}
}
