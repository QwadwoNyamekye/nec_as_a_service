import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { NbAuthService } from "@nebular/auth";
import { tap } from "rxjs/operators";
import { NecService } from "./@core/mock/nec.service";

@Injectable()
export class AuthGuard {
  constructor(
    private authService: NbAuthService,
    private router: Router,
    private necService: NecService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.isAuthenticated().pipe(
      tap((authenticated) => {
        if (!authenticated) {
          this.router.navigate(["auth/login"]);
        } else if (!this.necService.user) {
          this.router.navigate(["auth/login"]);
        } else if (this.necService.user.firstLogin) {
          this.router.navigate(["auth/reset-password"]);
        }
      })
    );
  }
}
