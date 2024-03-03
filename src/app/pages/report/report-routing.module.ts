import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NecReportComponent } from "./nec-report/nec-report.component";
import { UploadReportComponent } from "./upload-report/upload-report.component";

const routes: Routes = [
  {
    path: "nec-report",
    component: NecReportComponent,
  },
  {
    path: "upload-report",
    component: UploadReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}
