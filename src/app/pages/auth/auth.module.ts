import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AuthRoutingModule } from "./auth-routing.module";
import { NbAuthComponent } from "./auth.component";
import { NbLayoutModule } from "@nebular/theme";
import { NbCardModule } from "@nebular/theme";
import {
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbInputModule,
} from "@nebular/theme";
import { LoginComponent } from "./login/login.component";
import { LogoutComponent } from "./logout/logout.component";
import { ReactiveFormsModule } from "@angular/forms";
import {
  NbPasswordAuthStrategy,
  NbAuthModule,
  NbAuthJWTToken,
  NbTokenService,
} from "@nebular/auth";
import { Injector } from '@angular/core';
import { environment } from "../../../environments/environment.prod";

export let AppInjector: Injector;

const formSetting: any = {
  redirectDelay: 0,
  showMessages: {
    success: true,
  },
};

@NgModule({
  imports: [
    NbCardModule,
    NbLayoutModule,
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
          token: {
            class: NbAuthJWTToken,
            key: "token", // this parameter tells where to look for the token
          },
          baseEndpoint: environment.baseUrl,
          login: {
            endpoint: "/auth/api/v1/authenticate",
            method: "post",
            redirect: {
              success: "/pages/nec/single",
              failure: null, // stay on the same page
            },
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
            endpoint: "/auth/api/v1/forgot_password",
            method: "post",
          },
          resetPass: {
            endpoint: "/user/api/v1/reset_password",
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
  declarations: [LoginComponent, NbAuthComponent, LogoutComponent],
  // providers: [{ provide: NbTokenService, useClass: NbAuthJWTToken }],
})
export class NgxAuthModule {
  constructor(private injector: Injector) {
    AppInjector = this.injector;
  }
}
