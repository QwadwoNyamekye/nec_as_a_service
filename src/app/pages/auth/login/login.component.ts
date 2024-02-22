import { Component } from "@angular/core";
import { NbLoginComponent } from "@nebular/auth";
import { NbAuthResult } from "@nebular/auth";
import { stringify } from "querystring";

@Component({
  selector: "ngx-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent extends NbLoginComponent {
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
        console.log(JSON.stringify(result.getResponse().body.user));

        if (result.isSuccess()) {
          this.messages = result.getMessages();
          localStorage.setItem(
            "user",
            JSON.stringify(result.getResponse().body.user)
          );
        } else {
          this.errors = result.getErrors();
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
