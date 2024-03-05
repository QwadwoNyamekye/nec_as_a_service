import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NbAuthComponent } from "./auth.component";
import { LoginComponent } from "./login/login.component";
import { ChangePassword } from "./change-password/change-password.component";
import { RequestPasswordComponent } from "./request-password/request-password.component";
import { AuthAuthGuard } from "./auth-auth-guard.service";

export const routes: Routes = [
  {
    path: "",
    component: NbAuthComponent,
    children: [
      {
        path: "login",
        component: LoginComponent,
      },
      {
        path: "request-password",
        component: RequestPasswordComponent,
      },
      {
        path: "reset-password",
        component: ChangePassword,
        canActivate: [AuthAuthGuard]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
