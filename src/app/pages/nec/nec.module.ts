import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbListModule,
  NbMenuModule,
  NbRadioModule,
  NbSelectModule,
  NbSpinnerModule,
  NbTabsetModule,
  NbToastrModule,
  NbUserModule,
  NbWindowModule
} from "@nebular/theme";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { NgxEchartsModule } from "ngx-echarts";
import { ThemeModule } from "../../@theme/theme.module";
import { DeclineFileUploadComponent } from "./bulk/modals/decline-file-upload/decline-file-upload.component";
import { RejectFileUploadComponent } from "./bulk/modals/reject-file-upload/reject-file-upload.component";
import { SubmitForAuthorizationComponent } from "./bulk/modals/submit-for-authorization/submit-for-authorization.component";
import { SubmitForProcessingComponent } from "./bulk/modals/submit-for-processing/submit-for-processing.component";
import { BulkSingleRecordsComponent } from "./bulk/modals/upload_file_single/upload_file_single.component";
import { UploadFileComponent } from "./bulk/new/bulk-nec-request/bulk-nec-request.component";
import { NECRoutingModule, routedComponents } from "./nec-routing.module";
import { SingleNECRequestComponent } from "./single/single-nec-request/single-nec-request.component";
import { SingleNECComponent } from "./single/single.component";

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
    NECRoutingModule,
    NbToastrModule.forRoot(),
  ],
  declarations: [
    SingleNECComponent,
    SingleNECRequestComponent,
    UploadFileComponent,
    SubmitForProcessingComponent,
    SubmitForAuthorizationComponent,
    BulkSingleRecordsComponent,
    RejectFileUploadComponent,
    DeclineFileUploadComponent,
    ...routedComponents,
  ],
})
export class NECModule {}
