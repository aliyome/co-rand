import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from '../material.module';

import { RoomRoutingModule } from './room-routing.module';
import { RoomComponent } from './room.component';

@NgModule({
  declarations: [RoomComponent],
  imports: [CommonModule, RoomRoutingModule, MaterialModule, MatTableModule],
})
export class RoomModule {}
