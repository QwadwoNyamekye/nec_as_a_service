import { Component } from "@angular/core";
import { NbLoginComponent } from "@nebular/auth";
import { NbAuthResult } from "@nebular/auth";

@Component({
  selector: "ngx-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent extends NbLoginComponent {
  login(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;
    
    console.log(this.user)
    this.service
      .authenticate("email", this.user)
      .subscribe((result: NbAuthResult) => {
        this.submitted = false;

        console.log(result)
        console.log('***************')
        console.log(result.getToken().getValue())

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
