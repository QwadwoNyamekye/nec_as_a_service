import { Component, Input, OnInit } from "@angular/core";
import { NbDialogRef, NbToastrService } from "@nebular/theme";
import { NecService } from "../../../../@core/mock/nec.service";

@Component({
  selector: `ngx-institution-user-edit-modal`,
  template: `
    <nb-card>
      <nb-card-header
        ><div class="text-center">{{ title }}</div></nb-card-header
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
          {{ this.getOption() }}
        </button>
        <button nbButton hero status="danger" (click)="dismiss()">
          Dismiss
        </button>
      </nb-card-body>
    </nb-card>
  `,
  styleUrls: ["change-institution-user-status.component.scss"],
})
export class ChangeInstitutionUserStatusComponent implements OnInit {
  @Input() title: string;
  @Input() batchId: string;
  @Input() submittedBy: string;
  @Input() email: string;
  @Input() status: boolean;
  response: any;
  loading: boolean = false;

  constructor(
    protected ref: NbDialogRef<ChangeInstitutionUserStatusComponent>,
    public necService: NecService,
    private toastrService: NbToastrService
  ) {}

  ngOnInit(): void {}

  dismiss() {
    this.ref.close();
  }

  getOption() {
    if (this.status) {
      return "Disable";
    }
    return "Enable";
  }

  submit() {
    this.loading = true;
    this.response = this.necService
      .changeUserStatus({
        email: this.email,
        createdBy: this.necService.user.email,
        status: !this.status,
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
            "User Status Change Failed: " + error.error.errorMessage,
            "User Status Change",
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
              "User Status Change Failed: " + this.response.errorMessage,
              "User Status Change",
              {
                status: "danger",
                destroyByClick: true,
                duration: 8000,
              }
            );
          } else {
            this.toastrService.success(
              "User Status Change Success",
              "User Status Change",
              { status: "success", destroyByClick: true, duration: 8000 }
            );
            this.ref.close();
          }
        }
      );
  }
}
