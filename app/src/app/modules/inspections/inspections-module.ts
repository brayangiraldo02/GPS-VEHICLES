import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InspectionsRoutingModule } from './inspections-routing-module';
import { TableInspectionsComponent } from './pages/table-inspections/table-inspections.component';
import { SharedModule } from '../../shared/shared-module';


@NgModule({
  declarations: [
    TableInspectionsComponent
  ],
  imports: [
    CommonModule,
    InspectionsRoutingModule,
    SharedModule
  ]
})
export class InspectionsModule { }
