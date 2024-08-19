import { Component, Input } from "@angular/core";
import { NbDialogRef, NbToastrService } from "@nebular/theme";
import { NecService } from "../../../../@core/mock/nec.service";

@Component({
  selector: `ngx-institution-user-delete-modal`,
  template: `
    <nb-card>
      <nb-card-header
        ><div class="text-center">{{ title }}</div></nb-card-header
      >
      <nb-card-body>
        <button nbButton hero status="success" (click)="submit()">
          Authorize
        </button>
        <button nbButton hero status="danger" (click)="dismiss()">
          Dismiss
        </button>
      </nb-card-body>
    </nb-card>
  `,
  styleUrls: ["authorize-institution-user.component.scss"],
})
export class AuthorizeInstitutionUserComponent {
  @Input() title: string;
  @Input() data: any;

  response: any;

  constructor(
    protected ref: NbDialogRef<AuthorizeInstitutionUserComponent>,
    public necService: NecService,
    private toastrService: NbToastrService
  ) {}

  dismiss() {
    this.ref.close();
  }

  submit() {
    this.response = this.necService
      .authorizeUser({
        email: this.data.email,
        createdBy: this.necService.user.email,
      })
      .subscribe(
        (response) => {
          this.response = response;
          // window.parent.postMessage(this.service.getUsers());
        },
        (error) => {
          this.toastrService.danger(
            "User Authorization Failed: " + error.error.errorMessage,
            "User Authorization",
            {
              status: "danger",
              destroyByClick: true,
              duration: 8000,
            }
          );
        },
        () => {
          if (this.response.errorCode != "0") {
            this.toastrService.danger(
              "User Authorization Failed: " + this.response.errorMessage,
              "User Authorization",
              {
                status: "danger",
                destroyByClick: true,
                duration: 8000,
              }
            );
          } else {
            this.toastrService.success(
              "User Authorization Success",
              "Unlock User",
              {
                status: "success",
                destroyByClick: true,
                duration: 8000,
              }
            );
            this.ref.close();
          }
        }
      );
  }
}
