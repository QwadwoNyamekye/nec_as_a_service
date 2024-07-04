/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {
  ChangeDetectionStrategy,
  Component
} from "@angular/core";
import { NbAuthResult, NbRequestPasswordComponent, getDeepFromObject } from "@nebular/auth";

@Component({
  selector: "nb-request-password-page",
  styleUrls: ["./request-password.component.scss"],
  templateUrl: "./request-password.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestPasswordComponent extends NbRequestPasswordComponent {
  requestPass(): void {
    this.redirectDelay = this.getConfigValue(
      "forms.requestPassword.redirectDelay"
    );
    this.showMessages = this.getConfigValue(
      "forms.requestPassword.showMessages"
    );
    this.strategy = this.getConfigValue("forms.requestPassword.strategy");

    this.errors = [];
    this.submitted = true;

    this.service.requestPassword(this.strategy, this.user).subscribe(
      (result: NbAuthResult) => {
        this.submitted = false;
        if (result.isSuccess()) {
          this.messages = result.getMessages();
        } else {
          this.errors = result.getErrors();
        }

        const redirect = result.getRedirect();
        this.redirectDelay = 5000;
        if (redirect) {
          setTimeout(() => {
            return this.router.navigateByUrl(redirect);
          }, this.redirectDelay);
        }
        this.cd.detectChanges();
      },
      (error) => {},
      () => {}
    );
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}
