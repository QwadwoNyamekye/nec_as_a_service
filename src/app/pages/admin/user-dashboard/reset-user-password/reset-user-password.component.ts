import { Component, Input, OnInit } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { NecService } from "../../../../@core/mock/nec.service";
import { NbToastrService } from "@nebular/theme";

@Component({
  selector: `ngx-user-edit-modal`,
  template: `
    <nb-card>
      <nb-card-header
        ><div class="text-center">{{ title }}</div></nb-card-header
      >
      <nb-card-body>
        <button nbButton hero status="success" (click)="submit()">
          Accept
        </button>
        <button nbButton hero status="danger" (click)="dismiss()">
          Dismiss
        </button>
      </nb-card-body>
    </nb-card>
  `,
  styleUrls: ["reset-user-password.component.scss"],
})
export class ResetUserPasswordComponent implements OnInit {
  @Input() title: string;
  @Input() batchId: string;
  @Input() submittedBy: string;
  @Input() email: string;
  response: any;
  constructor(
    protected ref: NbDialogRef<ResetUserPasswordComponent>,
    public service: NecService,
    private toastrService: NbToastrService
  ) {}
  ngOnInit(): void {
    ;
  }
  dismiss() {
    this.ref.close();
  }
  submit() {
    this.response = this.service
      .resetUserPassword({
        email: this.email,
        createdBy: this.service.user.email,
      })
      .subscribe(
        (response) => {
          this.response = response;
          // window.parent.postMessage(this.service.getUsers());
        },
        (error) => {
          console.error(error);
          this.toastrService.warning(
            "User Password Reset Failed: " + error.error.errorMessage,
            "User Password Reset",
            {
              status: "danger",
              destroyByClick: true,
              duration: 8000,
            }
          );
        },
        () => {
          if (this.response.errorCode != "0") {
            this.toastrService.warning(
              "User Password Reset Failed: " + this.response.errorMessage,
              "User Password Reset",
              {
                status: "danger",
                destroyByClick: true,
                duration: 8000,
              }
            );
          } else {
            this.toastrService.success(
              "User Password Reset Success",
              "User Password Reset",
              { status: "success", destroyByClick: true, duration: 8000 }
            );
            this.ref.close();
          }
        }
      );
  }
}
