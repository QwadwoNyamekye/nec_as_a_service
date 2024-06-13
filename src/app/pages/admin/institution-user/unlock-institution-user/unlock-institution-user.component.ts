import { Component, Input, OnInit } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { NecService } from "../../../../@core/mock/nec.service";
import { NbToastrService } from "@nebular/theme";

@Component({
  selector: `ngx-institution-user-unlock-modal`,
  template: `
    <nb-card>
      <nb-card-header
        ><div class="text-center">{{ title }}</div></nb-card-header
      >
      <nb-card-body>
        <button nbButton hero status="success" (click)="submit()">
          Unlock
        </button>
        <button nbButton hero status="danger" (click)="dismiss()">
          Dismiss
        </button>
      </nb-card-body>
    </nb-card>
  `,
  styleUrls: ["unlock-institution-user.component.scss"],
})
export class UnlockInstitutionUserComponent implements OnInit {
  @Input() title: string;
  @Input() email: string;
  response: any;
  constructor(
    protected ref: NbDialogRef<UnlockInstitutionUserComponent>,
    public necService: NecService,
    private toastrService: NbToastrService
  ) {}
  ngOnInit(): void {}
  dismiss() {
    this.ref.close();
  }

  submit() {
    this.response = this.necService
      .unlockUser({
        email: this.email,
        createdBy: this.necService.user.email,
      })
      .subscribe(
        (response) => {
          this.response = response;
          // window.parent.postMessage(this.service.getUsers());
        },
        (error) => {
          this.toastrService.warning(
            "Unlock User Failed: " + error.error.errorMessage,
            "Unlock User",
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
              "Unlock User Failed: " + this.response.errorMessage,
              "Unlock User",
              {
                status: "danger",
                destroyByClick: true,
                duration: 8000,
              }
            );
          } else {
            this.toastrService.success("Unlock User Success", "Unlock User", {
              status: "success",
              destroyByClick: true,
              duration: 8000,
            });
            this.ref.close();
          }
        }
      );
  }
}
