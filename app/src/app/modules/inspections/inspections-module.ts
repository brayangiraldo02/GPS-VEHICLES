import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InspectionsRoutingModule } from './inspections-routing-module';
import { TableInspectionsComponent } from './pages/table-inspections/table-inspections.component';
import { SharedModule } from '../../shared/shared-module';
import { DialogNewInspectionComponent } from './components/dialog-new-inspection/dialog-new-inspection.component';
import { MatSelect, MatOption } from "@angular/material/select";
import { CameraUploadComponent } from './components/camera-upload/camera-upload.component';
import { PhotoPreviewDialogComponent } from './components/photo-preview-dialog/photo-preview-dialog.component';
import { PhotoGalleryDialogComponent } from './components/photo-gallery-dialog/photo-gallery-dialog.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    TableInspectionsComponent,
    DialogNewInspectionComponent,
    CameraUploadComponent,
    PhotoPreviewDialogComponent,
    PhotoGalleryDialogComponent
  ],
  imports: [
    CommonModule,
    InspectionsRoutingModule,
    SharedModule,
    MatProgressBarModule
  ]
})
export class InspectionsModule { }

