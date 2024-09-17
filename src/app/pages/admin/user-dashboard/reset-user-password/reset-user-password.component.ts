import { Component, Input, OnInit } from "@angular/core";
import { NbDialogRef, NbToastrService } from "@nebular/theme";
import { NecService } from "../../../../@core/mock/nec.service";

@Component({
  selector: `ngx-user-edit-modal`,
  template: `
    <nb-card>
      <nb-card-header
        ><div class="text-center">
          {{ "Reset User Password for User:" + currentValues.name }}
        </div></nb-card-header
      >
      <nb-card-body>
        <button
          nbButton
          hero
          status="success"
          (click)="submit()"
          [nbSpinner]="loading"
          nbSpinnerStatus="danger"
          [disabled]="loading"
        >
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
  @Input() currentValues: any;
  response: any;
  loading: boolean = false;

  constructor(
    protected ref: NbDialogRef<ResetUserPasswordComponent>,
    public necService: NecService,
    private toastrService: NbToastrService
  ) {}
  ngOnInit(): void {}
  dismiss() {
    this.ref.close();
  }
  submit() {
    this.loading = true;
    this.response = this.necService
      .resetUserPassword({
        email: this.currentValues.email,
        createdBy: this.necService.user.email,
        institutionCode: this.currentValues.institutionCode,
        bankCode: this.currentValues.bankCode,
      })
      .subscribe(
        (response) => {
          this.response = response;
          this.loading = false;
          // window.parent.postMessage(this.service.getUsers());
        },
        (error) => {
          this.loading = false;
          this.toastrService.danger(
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
            this.toastrService.danger(
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
