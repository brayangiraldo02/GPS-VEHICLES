import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [],
  imports: [CommonModule, MatIconModule, MatCardModule, MatToolbarModule, MatButtonModule],
  exports: [MatIconModule, MatCardModule, MatToolbarModule, MatButtonModule],
})
export class SharedModule {}
