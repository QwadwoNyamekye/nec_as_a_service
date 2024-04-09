import { NgModule } from "@angular/core";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { NbSpinnerModule } from "@nebular/theme";
import {
  NbMenuModule,
  NbButtonModule,
  NbCardModule,
  NbSelectModule,
  NbTabsetModule,
  NbWindowModule,
  NbActionsModule,
  NbUserModule,
  NbRadioModule,
  NbListModule,
  NbIconModule,
  NbInputModule,
  NbDatepicker,
  NbDatepickerModule,
} from "@nebular/theme";
import { NbToastrModule } from "@nebular/theme";
import { NgxEchartsModule } from "ngx-echarts";
import { ThemeModule } from "../../@theme/theme.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ReportRoutingModule } from "./report-routing.module";
import { NecReportComponent } from "./nec-report/nec-report.component";
import { UploadReportComponent } from "./upload-report/upload-report.component";
import { AuditLogsComponent } from "./audit-logs/audit-logs.component";


@NgModule({
  imports: [
    NbSpinnerModule,
    NbInputModule,
    NbWindowModule,
    NbMenuModule,
    FormsModule,
    ThemeModule,
    NbCardModule,
    NbUserModule,
    NbButtonModule,
    NbTabsetModule,
    NbActionsModule,
    NbRadioModule,
    NbSelectModule,
    NbListModule,
    NbIconModule,
    NbButtonModule,
    NgxEchartsModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    ReportRoutingModule,
    NbToastrModule.forRoot(),
    NbDatepickerModule
  ],
  declarations: [
    NecReportComponent,
    UploadReportComponent,
    AuditLogsComponent
  ],
})
export class ReportModule {}
