import { Component } from "@angular/core";
import { NbLogoutComponent } from "@nebular/auth";
import { NbAuthResult } from "@nebular/auth";
import { NecService } from "../../../@core/mock/nec.service";
import { AppInjector } from "../auth.module";

@Component({
  selector: "ngx-logout",
  templateUrl: "./logout.component.html",
})
export class LogoutComponent extends NbLogoutComponent {
  necService = AppInjector.get(NecService);

  logout(strategy: string): void {
    sessionStorage.clear()
    localStorage.clear()
    this.necService.user = null;
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
