import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { NbRoleProvider } from "@nebular/security";
import { NbAuthService } from "@nebular/auth";
import { NbAuthJWTToken } from "@nebular/auth";
import { map } from "rxjs/operators";


@Injectable({
    providedIn: 'root',
  })
  export class RoleProvider implements NbRoleProvider {
  
    constructor(private authService: NbAuthService) {
    }
  
    getRole(): Observable<string[]> {
      return this.authService.onTokenChange()
        .pipe(
          map((token: NbAuthJWTToken) => {
            const roles: string[] = token.getValue()['realm_access']['roles'];
            return roles;
          }),
        );
    }
  }