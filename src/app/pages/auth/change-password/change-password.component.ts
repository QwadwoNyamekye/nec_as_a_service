import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from "@angular/core";
import { Router } from "@angular/router";
import {
  NB_AUTH_OPTIONS,
  NbAuthService,
  getDeepFromObject,
} from "@nebular/auth";
import { NecService } from "../../../@core/mock/nec.service";

@Component({
  selector: "nb-reset-password-page",
  styleUrls: ["./change-password.component.scss"],
  templateUrl: "./change-password.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePassword implements OnInit {
  redirectDelay: number = 0;
  showMessages: any = {};
  strategy: string = "";
  submitted = false;
  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  new_user_credentials: any = {};
  passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  passwordRegexInvalid: boolean;
  countdownMessage: string;

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  toggleShowCurrentPassword() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }
  toggleShowNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }
  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  constructor(
    protected service: NbAuthService,
    protected necService: NecService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    public router: Router
  ) {
    this.redirectDelay = this.getConfigValue(
      "forms.resetPassword.redirectDelay"
    );
    this.showMessages = this.getConfigValue("forms.resetPassword.showMessages");
    this.strategy = this.getConfigValue("forms.resetPassword.strategy");
  }
  ngOnInit(): void {
    this.passwordRegexInvalid = true;
  }

  validatePassword(password) {
    if (this.passwordRegex.test(password)) {
      this.passwordRegexInvalid = false;
      return "Password is Valid";
    } else {
      if (!/[a-z]/.test(password)) {
        return "Password must contain at least one lowercase letter.";
      } else if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase letter.";
      } else if (!/[0-9]/.test(password)) {
        return "Password must contain at least one digit.";
      } else if (!/[!@#$%^&*_=+-]/.test(password)) {
        return "Password must contain at least one special character.";
      }
    }
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
        this.submitted = false;
        if (result.errorCode == "0") {
          this.messages[0] = result.errorMessage;

          var time = 5;
          var intervalId = setInterval(
            function (router) {
              if (document.getElementById("time")) {
                document.getElementById("time").innerHTML =
                  "Redirecting to Login in : " + time;
              }
              if (time == 0) {
                router.navigate(["auth/login"]);
                window.clearInterval(intervalId);
              }
              time--;
            },
            1000,
            this.router
          );
        } else if (result.errorCode == "1") {
          this.errors[0] = result.errorMessage;
        }
        // setTimeout(() => {
        //   return this.router.navigateByUrl(homePath);
        // }, this.redirectDelay);
        this.cd.detectChanges();
      },
      (error) => {}
    );
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}
