import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NecReportComponent } from "./nec-report/nec-report.component";

const routes: Routes = [
  {
    path: "nec-report",
    component: NecReportComponent,
  },
  // {
  //   path: "bulk",
  //   component: BulkUploadComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}
