import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InspectionsRoutingModule } from './inspections-routing-module';
import { TableInspectionsComponent } from './pages/table-inspections/table-inspections.component';
import { SharedModule } from '../../shared/shared-module';
import { DialogNewInspectionComponent } from './dialogs/dialog-new-inspection/dialog-new-inspection.component';
import { MatSelect, MatOption } from '@angular/material/select';
import { CameraUploadComponent } from './components/camera-upload/camera-upload.component';
import { PhotoPreviewDialogComponent } from './dialogs/photo-preview-dialog/photo-preview-dialog.component';
import { PhotoGalleryDialogComponent } from './dialogs/photo-gallery-dialog/photo-gallery-dialog.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SignatureUploadComponent } from './components/signature-upload/signature-upload.component';

@NgModule({
  declarations: [
    TableInspectionsComponent,
    DialogNewInspectionComponent,
    CameraUploadComponent,
    PhotoPreviewDialogComponent,
    PhotoGalleryDialogComponent,
    SignatureUploadComponent,
  ],
  imports: [CommonModule, InspectionsRoutingModule, SharedModule, MatProgressBarModule],
})
export class InspectionsModule {}
