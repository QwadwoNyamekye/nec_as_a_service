import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NbAuthComponent } from "./auth.component";

import { LoginComponent } from "./login/login.component";
import { NbResetPasswordComponent } from "@nebular/auth";
import { NbRequestPasswordComponent } from "./request-password/request-password.component";

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
        component: NbRequestPasswordComponent,
      },
      {
        path: "reset-password",
        component: NbResetPasswordComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
