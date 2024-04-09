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
} from "@nebular/theme";
import { NbToastrModule } from "@nebular/theme";
import { NgxEchartsModule } from "ngx-echarts";
import { ThemeModule } from "../../@theme/theme.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NECRoutingModule, routedComponents } from "./nec-routing.module";
import { SingleNECComponent } from "./single/single.component";
import { SingleNECRequestComponent } from "./single/single-nec-request/single-nec-request.component";
import { UploadFileComponent } from "./bulk/new/bulk-nec-request/bulk-nec-request.component";
import { SubmitForProcessingComponent } from "./bulk/modals/submit-for-processing/submit-for-processing.component";
import { SingleNECComponent as FileRecord } from "./bulk/modals/upload_file_single/single.component";
import { SubmitForAuthorizationComponent } from "./bulk/modals/submit-for-authorization/submit-for-authorization.component";
import { RejectFileUploadComponent } from "./bulk/modals/reject-file-upload/reject-file-upload.component";
import { DeclineFileUploadComponent } from "./bulk/modals/decline-file-upload/decline-file-upload.component";

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
    FileRecord,
    RejectFileUploadComponent,
    DeclineFileUploadComponent,
    ...routedComponents,
  ],
})
export class NECModule {}
