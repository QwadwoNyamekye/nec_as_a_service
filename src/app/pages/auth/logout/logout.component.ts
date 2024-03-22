import { Component } from "@angular/core";
import { NbLoginComponent, NbLogoutComponent } from "@nebular/auth";
import { NbAuthResult } from "@nebular/auth";

@Component({
  selector: "ngx-logout",
  templateUrl: "./logout.component.html",
})
export class LogoutComponent extends NbLogoutComponent {
  logout(strategy: string): void {
    sessionStorage.clear()
    this.service.logout(strategy).subscribe((result: NbAuthResult) => {
      const redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, this.redirectDelay);
      }
    });
  }
}
