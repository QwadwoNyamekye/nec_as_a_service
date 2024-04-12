import { NgModule } from "@angular/core";
import { Ng2SmartTableModule } from "ng2-smart-table";
import {
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
  NbMenuModule,
  NbSpinnerModule,
} from "@nebular/theme";
import { ThemeModule } from "../../@theme/theme.module";
import { AdminDashboardComponent } from "./user-dashboard/user-dashboard.component";
import { AddUserFormComponent } from "./user-dashboard/add-user-form/add-user-form.component";
import { EditUserFormComponent } from "./user-dashboard/edit-user-form/edit-user-form.component";
import { AddInstitutionFormComponent } from "./institution-dashboard/add-institution-form/add-institution-form.component";
import { EditInstitutionFormComponent } from "./institution-dashboard/edit-institution-form/edit-institution-form.component";
import { InstitutionDashboardComponent } from "./institution-dashboard/institution-dashboard.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EditUserPropFormComponent } from "./user-dashboard/edit-user-prop-form/edit-user-prop-form.component";
import { ResetUserPasswordComponent } from "./user-dashboard/reset-user-password/reset-user-password.component";
import { UnlockUserComponent } from "./user-dashboard/unlock-user/unlock-user.component";
import { ChangeUserStatusComponent } from "./user-dashboard/change-user-status/change-user-status.component";
import { ChangeInstitutionStatusComponent } from "./institution-dashboard/change-institution-status/change-institution-status.component";
import { DeleteUserComponent } from "./user-dashboard/delete-user/delete-user.component";

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
    EditUserPropFormComponent,
    ResetUserPasswordComponent,
    UnlockUserComponent,
    ChangeUserStatusComponent,
    ChangeInstitutionStatusComponent,
    DeleteUserComponent,
  ],
})
export class AdminModule {}
