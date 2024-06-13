import { Component, Input, OnInit } from "@angular/core";
import { NbDialogRef, NbToastrService } from "@nebular/theme";
import { NecService } from "../../../../@core/mock/nec.service";

@Component({
  selector: `ngx-user-edit-modal`,
  template: `
    <nb-card>
      <nb-card-header
        ><div class="text-center">
          {{ "Unlock User: " + currentValues.name }}
        </div></nb-card-header
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
  styleUrls: ["unlock-user.component.scss"],
})
export class UnlockUserComponent implements OnInit {
  @Input() currentValues: any;
  response: any;
  constructor(
    protected ref: NbDialogRef<UnlockUserComponent>,
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
        email: this.currentValues.email,
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
