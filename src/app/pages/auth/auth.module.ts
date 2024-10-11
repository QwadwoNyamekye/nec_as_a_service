import { CommonModule } from "@angular/common";
import { Injector, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import {
  NbAuthJWTToken,
  NbAuthModule,
  NbPasswordAuthStrategy,
} from "@nebular/auth";
import {
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
} from "@nebular/theme";
import { environment } from "../../../environments/environment.prod";
import { AuthAuthGuard } from "./auth-auth-guard.service";
import { AuthRoutingModule } from "./auth-routing.module";
import { NbAuthComponent } from "./auth.component";
import { ChangePassword } from "./change-password/change-password.component";
import { LoginComponent } from "./login/login.component";
import { LogoutComponent } from "./logout/logout.component";
import { RequestPasswordComponent } from "./request-password/request-password.component";
import { HttpResponse } from "@angular/common/http";

export let AppInjector: Injector;

const formSetting: any = {
  redirectDelay: 0,
  showMessages: {
    success: true,
  },
};

@NgModule({
  imports: [
    NbFormFieldModule,
    NbIconModule,
    MatIconModule,
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
          messages: {
            getter: (module: string, res: HttpResponse<String>) => {
              sessionStorage.setItem("responseBody", JSON.stringify(res["body"]));
            },
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
  declarations: [
    LoginComponent,
    NbAuthComponent,
    LogoutComponent,
    RequestPasswordComponent,
    ChangePassword,
  ],
  providers: [AuthAuthGuard],
})
export class NgxAuthModule {
  constructor(private injector: Injector) {
    AppInjector = this.injector;
  }
}
