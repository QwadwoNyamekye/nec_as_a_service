import { NgModule } from "@angular/core";
import { Ng2SmartTableModule } from "ng2-smart-table";
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
} from "@nebular/theme";
import { NbToastrModule } from "@nebular/theme";
import { NgxEchartsModule } from "ngx-echarts";
import { ThemeModule } from "../../@theme/theme.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NECRoutingModule } from "./nec-routing.module";
import { BulkUploadComponent } from "./bulk/bulk.component";
import { SingleNECComponent } from "./single/single.component";
import { SingleNECRequestComponent } from "./single/single-nec-request/single-nec-request.component";
import { BulkNEComponent } from "./bulk/bulk-nec-request/bulk-nec-request.component";
import { SubmitForProcessingComponent } from "./bulk/submit-for-processing/submit-for-processing.component";
import { SingleNECComponent as FileRecord } from "./bulk/upload_file_single/single.component";
import { SubmitForAuthorizationComponent } from "./bulk/submit-for-authorization/submit-for-authorization.component";

@NgModule({
  imports: [
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
    NECRoutingModule,
    NbToastrModule.forRoot(),
  ],
  declarations: [
    SingleNECComponent,
    BulkUploadComponent,
    SingleNECRequestComponent,
    BulkNEComponent,
    SubmitForProcessingComponent,
    SubmitForAuthorizationComponent,
    FileRecord
  ],
})
export class NECModule {}
