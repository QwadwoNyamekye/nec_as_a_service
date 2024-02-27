import { Component } from "@angular/core";
import { NbLoginComponent } from "@nebular/auth";
import { NbAuthResult } from "@nebular/auth";
import { NecService } from "../../../@core/mock/nec.service";
import { AppInjector } from "../auth.module";

@Component({
  selector: "ngx-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent extends NbLoginComponent {
  necService = AppInjector.get(NecService);
  login(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    console.log(this.user);
    this.service
      .authenticate("email", this.user)
      .subscribe((result: NbAuthResult) => {
        this.submitted = false;
        console.log(result);
        console.log("***************");
        console.log(JSON.stringify(result.getResponse().body?.user));

        if (result.isSuccess()) {
          this.messages = result.getMessages();
          localStorage.setItem(
            "user",
            JSON.stringify(result.getResponse().body.user)
          );
          this.necService.initializeWebSocketConnection();
        } else {
          this.errors = result.getErrors();
          if (this.errors[0] == "Token is empty or invalid."){
            this.errors[0] = "Please check your username or password"
          }
          console.log(this.errors)
        }

        const redirect = result.getRedirect();
        if (redirect) {
          setTimeout(() => {
            return this.router.navigateByUrl(redirect);
          }, this.redirectDelay);
        }
        this.cd.detectChanges();
      });
  }
}
