import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BulkCompletedUploadComponent } from "./bulk/completed/completed-bulk-upload.component";
import { BulkDeclinedUploadComponent } from "./bulk/declined/declined-bulk-upload.component";
import { BulkNewUploadComponent } from "./bulk/new/new-bulk-upload.component";
import { BulkProcessingUploadComponent } from "./bulk/processing/processing-bulk-upload.component";
import { BulkRejectedUploadComponent } from "./bulk/rejected/rejected-bulk-upload.component";
import { BulkSubmittedUploadComponent } from "./bulk/submitted/submitted-bulk-upload.component";
import { SingleNECComponent } from "./single/single.component";
import { ActionsRendererComponent } from "./bulk/new/actions-component/actions.component";

const routes: Routes = [
  {
    path: "single",
    component: SingleNECComponent,
  },
  {
    path: "bulk",
    children: [
      {
        path: "new",
        component: BulkNewUploadComponent,
      },
      {
        path: "completed",
        component: BulkCompletedUploadComponent,
      },
      {
        path: "processing",
        component: BulkProcessingUploadComponent,
      },
      {
        path: "submitted",
        component: BulkSubmittedUploadComponent,
      },
      {
        path: "rejected",
        component: BulkRejectedUploadComponent,
      },
      {
        path: "declined",
        component: BulkDeclinedUploadComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NECRoutingModule {}
export const routedComponents = [
  BulkNewUploadComponent,
  BulkCompletedUploadComponent,
  BulkProcessingUploadComponent,
  BulkSubmittedUploadComponent,
  BulkRejectedUploadComponent,
  BulkDeclinedUploadComponent,
  ActionsRendererComponent,
];
