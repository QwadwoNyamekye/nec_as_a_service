import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AuthRoutingModule } from "./auth-routing.module";
import {
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbInputModule,
} from "@nebular/theme";
import { LoginComponent } from "./login/login.component";
import { ReactiveFormsModule } from "@angular/forms";
import { NbPasswordAuthStrategy, NbAuthModule } from "@nebular/auth";

const formSetting: any = {
  redirectDelay: 0,
  showMessages: {
    success: true,
  },
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    AuthRoutingModule,
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: "email",

          baseEndpoint: "http://172.27.21.210:8089",
          login: {
            endpoint: "/user/api/v1/authenticate",
            method: "post",
          },
          register: {
            endpoint: "/user/api/v1/create_user",
            method: "post",
          },
          logout: {
            endpoint: "/auth/sign-out",
            method: "post",
          },
          requestPass: {
            endpoint: "/auth/request-pass",
            method: "post",
          },
          resetPass: {
            endpoint: "/auth/reset-pass",
            method: "post",
          },
        }),
      ],
      forms: {
        login: formSetting,
        register: formSetting,
        requestPassword: formSetting,
        resetPassword: formSetting,
        logout: {
          redirectDelay: 0,
        },
      },
    }),
  ],
  declarations: [LoginComponent],
})
export class NgxAuthModule {}
