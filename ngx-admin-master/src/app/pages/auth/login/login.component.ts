import { Component } from "@angular/core";
import { NbLoginComponent } from "@nebular/auth";
import { NbAuthResult } from "@nebular/auth";

@Component({
  selector: "ngx-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent extends NbLoginComponent {
  login(): void {
    console.log("+++++++++++++++++++++++++++++++++++")
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    const data = {
      variables: this.user,
      query:
        "mutation($username: String!, $password: String!) { login(username: $username, password: $password) { token } }",
    };
    this.service
      .authenticate(this.strategy, data)
      .subscribe((result: NbAuthResult) => {
        this.submitted = false;

        if (result.isSuccess()) {
          this.messages = result.getMessages();
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
