import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableInspectionsComponent } from './pages/table-inspections/table-inspections.component';

const routes: Routes = [
  {
    path: '',
    component: TableInspectionsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InspectionsRoutingModule {}
