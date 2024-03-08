import { Component } from "@angular/core";
import { NbLoginComponent } from "@nebular/auth";
import { NbAuthResult } from "@nebular/auth";
import { NecService } from "../../../@core/mock/nec.service";
import { AppInjector } from "../auth.module";
import { MENU_ITEMS } from "../../pages-menu";

@Component({
  selector: "ngx-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent extends NbLoginComponent {
  necService = AppInjector.get(NecService);
  showPassword = true;

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

    console.log(this.user);
    this.service.authenticate("email", this.user).subscribe(
      (result: NbAuthResult) => {
        this.submitted = false;
        console.log(result);
        console.log(JSON.stringify(result.getResponse().body?.user));

        if (result.isSuccess()) {
          this.messages = result.getMessages();
          sessionStorage.setItem(
            "user",
            JSON.stringify(result.getResponse().body.user)
          );
          console.log(MENU_ITEMS());
          console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^");
          console.log(sessionStorage.getItem("homePath"));
          console.log(result.getResponse().body.token);
          sessionStorage.setItem("token", result.getResponse().body.token);
          this.necService.initializeVars();
          this.necService.initializeWebSocketConnection();
        } else {
          this.errors = result.getErrors();
          if (this.errors[0] == "Token is empty or invalid.") {
            this.errors[0] = "Please check your username or password";
          }
          console.log(this.errors);
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
      (error) => console.log(error),
      () => {}
    );
  }
}
