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
  NbUserModule,
  NbWindowModule,
} from "@nebular/theme";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { ThemeModule } from "../../@theme/theme.module";
import { AdminRoutingModule } from "./admin-routing.module";
import { AddInstitutionFormComponent } from "./institution-dashboard/add-institution-form/add-institution-form.component";
import { AuthorizeInstutionCreationComponent } from "./institution-dashboard/authorize-institution-creation/authorize-institution-creation";
import { ChangeInstitutionStatusComponent } from "./institution-dashboard/change-institution-status/change-institution-status.component";
import { EditInstitutionFormComponent } from "./institution-dashboard/edit-institution-form/edit-institution-form.component";
import { InstitutionDashboardComponent } from "./institution-dashboard/institution-dashboard.component";
import { AddInstutionUserFormComponent } from "./institution-user/add-institution-user-form/add-institution-user-form.component";
import { ChangeInstitutionUserStatusComponent } from "./institution-user/change-institution-user-status/change-institution-user-status.component";
import { DeleteInstitutionUserComponent } from "./institution-user/delete-institution-user/delete-institution-user.component";
import { EditInstitutionUserFormComponent } from "./institution-user/edit-institution-user-form/edit-institution-user-form.component";
import { InstitutionUserDashboardComponent } from "./institution-user/institution-user-dashboard.component";
import { ResetInstitutionUserPasswordComponent } from "./institution-user/reset-institution-user-password/reset-institution-user-password.component";
import { UnlockInstitutionUserComponent } from "./institution-user/unlock-institution-user/unlock-institution-user.component";
import { AddUserFormComponent } from "./user-dashboard/add-user-form/add-user-form.component";
import { ChangeUserStatusComponent } from "./user-dashboard/change-user-status/change-user-status.component";
import { DeleteUserComponent } from "./user-dashboard/delete-user/delete-user.component";
import { EditUserFormComponent } from "./user-dashboard/edit-user-form/edit-user-form.component";
import { ResetUserPasswordComponent } from "./user-dashboard/reset-user-password/reset-user-password.component";
import { UnlockUserComponent } from "./user-dashboard/unlock-user/unlock-user.component";
import { AdminDashboardComponent } from "./user-dashboard/user-dashboard.component";

@NgModule({
  imports: [
    AdminRoutingModule,
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
    Ng2SmartTableModule,
    ReactiveFormsModule,
  ],
  declarations: [
    AdminDashboardComponent,
    InstitutionDashboardComponent,
    AddUserFormComponent,
    EditUserFormComponent,
    EditInstitutionFormComponent,
    AddInstitutionFormComponent,
    ResetUserPasswordComponent,
    UnlockUserComponent,
    ChangeUserStatusComponent,
    ChangeInstitutionStatusComponent,
    DeleteUserComponent,
    UnlockInstitutionUserComponent,
    InstitutionUserDashboardComponent,
    ResetInstitutionUserPasswordComponent,
    DeleteInstitutionUserComponent,
    ChangeInstitutionUserStatusComponent,
    AddInstutionUserFormComponent,
    EditInstitutionUserFormComponent,
    AuthorizeInstutionCreationComponent,
  ],
})
export class AdminModule {}
