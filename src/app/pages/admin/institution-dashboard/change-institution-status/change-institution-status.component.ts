import { Component, Input, OnInit } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { NbToastrService } from "@nebular/theme";
import { NecService } from "../../../../@core/mock/nec.service";

@Component({
  selector: `ngx-user-edit-modal`,
  template: `
    <nb-card>
      <nb-card-header
        ><div class="text-center">{{ title }}</div></nb-card-header
      >
      <nb-card-body>
        <button nbButton hero status="success" (click)="submit($event)">
          {{ action }}
        </button>
        <button nbButton hero status="danger" (click)="dismiss()">
          Dismiss
        </button>
      </nb-card-body>
    </nb-card>
  `,
  styleUrls: ["change-institution-status.component.scss"],
})
export class ChangeInstitutionStatusComponent implements OnInit {
  @Input() title: string;
  @Input() batchId: string;
  @Input() submittedBy: string;
  @Input() status: boolean;
  @Input() code: string;
  action: any;
  response: any;

  constructor(
    protected ref: NbDialogRef<ChangeInstitutionStatusComponent>,
    public necService: NecService,
    private toastrService: NbToastrService
  ) {}

  ngOnInit(): void {
    if (this.status) {
      this.action = "Disable";
    } else {
      this.action = "Enable";
    }
  }

  submit(event) {
    this.response = this.necService
      .changeInstitutionStatus({
        code: this.code,
        status: !this.status,
        createdBy: this.necService.user.email,
      })
      .subscribe(
        (response) => {
          this.response = response;
          // window.parent.postMessage(this.service.getInstitutions());
          return response;
        },
        (error) => {
          this.toastrService.warning(
            "Institution Status Change Failed: " + error.error.errorMessage,
            "Institution Status Change",
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
              "Institution Status Change Failed: " + this.response.errorMessage,
              "Institution Status Change",
              {
                status: "danger",
                destroyByClick: true,
                duration: 8000,
              }
            );
          } else {
            this.toastrService.success(
              "Institution Status Change Success",
              "Institution Status Change",
              { status: "success", destroyByClick: true, duration: 8000 }
            );
            this.ref.close();
          }
        }
      );
  }

  dismiss() {
    this.ref.close();
  }
}
