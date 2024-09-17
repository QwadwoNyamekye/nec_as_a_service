import { Component } from "@angular/core";
import { NbAuthResult, NbLoginComponent } from "@nebular/auth";
import { NecService } from "../../../@core/mock/nec.service";
import { MENU_ITEMS } from "../../pages-menu";
import { AppInjector } from "../auth.module";

@Component({
  selector: "ngx-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent extends NbLoginComponent {
  necService = AppInjector.get(NecService);
  showPassword = false;

  getInputType() {
    if (this.showPassword) {
      return 'text';
    }
    return 'password';
  }
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    this.errors = [];
    this.submitted = true;
    this.service.authenticate("email", this.user).subscribe(
      (result: NbAuthResult) => {
        console.log("++++++++++++++");
        console.log(result)
        this.submitted = false;
        if (result.isSuccess()) {
          this.messages = result.getMessages();
          sessionStorage.setItem(
            "user",
            JSON.stringify(result.getResponse().body.user)
          );
          MENU_ITEMS()
          sessionStorage.setItem("token", result.getResponse().body.token);
          this.necService.initializeVars();
          this.necService.initializeWebSocketConnection(this.necService.errorToastr);
        } else {
          this.errors = result.getErrors();
          if (this.errors[0] == "Token is empty or invalid.") {
            this.errors[0] = "Please check your username or password";
          }
          else {
            this.errors[0] = result.getResponse().errorMessage
          }
        }

        const redirect = result.getRedirect();
        if (redirect) {
          setTimeout(() => {
            return this.router.navigateByUrl(
              sessionStorage.getItem("homePath")
            );
          }, this.redirectDelay);
        }
        this.cd.detectChanges();
      },
      (error) => {},
      () => { }
    );
  }
}
