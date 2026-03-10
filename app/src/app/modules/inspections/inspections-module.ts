import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InspectionsRoutingModule } from './inspections-routing-module';
import { TableInspectionsComponent } from './pages/table-inspections/table-inspections.component';
import { SharedModule } from '../../shared/shared-module';
import { DialogNewInspectionComponent } from './components/dialog-new-inspection/dialog-new-inspection.component';
import { MatSelect, MatOption } from "@angular/material/select";


@NgModule({
  declarations: [
    TableInspectionsComponent,
    DialogNewInspectionComponent
  ],
  imports: [
    CommonModule,
    InspectionsRoutingModule,
    SharedModule
]
})
export class InspectionsModule { }

