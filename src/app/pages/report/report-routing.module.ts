import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NecReportComponent } from "./nec-report/nec-report.component";
import { UploadReportComponent } from "./upload-report/upload-report.component";
import { AuditLogsComponent } from "./audit-logs/audit-logs.component";

const routes: Routes = [
  {
    path: "nec-report",
    component: NecReportComponent,
  },
  {
    path: "upload-report",
    component: UploadReportComponent,
  },
  {
    path: "audit-logs",
    component: AuditLogsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}
