import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SingleNECComponent } from "./single/single.component";
import { BulkUploadComponent } from "./bulk/bulk.component";

const routes: Routes = [
  {
    path: "single",
    component: SingleNECComponent,
  },
  {
    path: "bulk",
    component: BulkUploadComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NECRoutingModule {}
