import { NgModule } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule, MatDivider } from '@angular/material/divider';

const materials = [
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatInputModule,
  MatFormFieldModule,
  MatDialogModule,
  MatSnackBarModule,
  MatCardModule,
  MatMenuModule,
  MatExpansionModule,
  MatDividerModule,
];

@NgModule({
  declarations: [],
  imports: materials,
  exports: materials,
  providers: [],
})
export class MaterialModule {}
