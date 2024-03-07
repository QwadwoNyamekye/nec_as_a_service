/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
} from "@angular/core";
import { Router } from "@angular/router";
import { NB_AUTH_OPTIONS } from "@nebular/auth";
import { getDeepFromObject } from "@nebular/auth";
import { NbAuthService } from "@nebular/auth";
import { NecService } from "../../../@core/mock/nec.service";

@Component({
  selector: "nb-reset-password-page",
  styleUrls: ["./change-password.component.scss"],
  templateUrl: "./change-password.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePassword {
  redirectDelay: number = 0;
  showMessages: any = {};
  strategy: string = "";

  submitted = false;
  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  new_user_credentials: any = {};

  constructor(
    protected service: NbAuthService,
    protected necService: NecService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected router: Router
  ) {
    this.redirectDelay = this.getConfigValue(
      "forms.resetPassword.redirectDelay"
    );
    this.showMessages = this.getConfigValue("forms.resetPassword.showMessages");
    this.strategy = this.getConfigValue("forms.resetPassword.strategy");
  }

  resetPass(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;
    this.new_user_credentials = {
      email: this.necService.user.email,
      password: this.user.currentPassword,
      newPassword: this.user.password,
      confirmPassword: this.user.confirmPassword,
    };

    this.necService.changePassword(this.new_user_credentials).subscribe(
      (result: any) => {
        console.log("KKKKKKKKKKKKKKKKKKKKK");
        console.log(this.user);
        console.log(result);
        console.log(typeof result);
        this.submitted = false;
        if (result.errorCode == "0") {
          this.messages[0] = result.errorMessage;
          return this.router.navigate(["auth/login"]);
        } else if (result.errorCode == "1") {
          this.errors[0] = result.errorMessage;
        }
        // setTimeout(() => {
        //   return this.router.navigateByUrl(homePath);
        // }, this.redirectDelay);
        this.cd.detectChanges();
      },
      (error) => {
        console.log("PPPPPPPPPPPPPPP");
        console.log(error);
      }
    );
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}
