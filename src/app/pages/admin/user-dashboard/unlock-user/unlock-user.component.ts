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
  styleUrls: ["unlock-user.component.scss"],
})
export class UnlockUserComponent implements OnInit {
  @Input() title: string;
  @Input() batchId: string;
  @Input() submittedBy: string;
  @Input() email: string;
  response: any;
  constructor(
    protected ref: NbDialogRef<UnlockUserComponent>,
    public service: NecService,
    private toastrService: NbToastrService
  ) {}
  ngOnInit(): void {
    // this.service.initializeWebSocketConnection();
  }
  dismiss() {
    this.ref.close();
  }
  submit() {
    this.response = this.service
      .unlockUser({
        email: this.email,
        createdBy: this.service.user.email,
      })
      .subscribe(
        (response) => {
          console.log(response);
          this.response = response;

          window.parent.postMessage(this.service.getUsers());
        },
        (error) => console.error(error),
        () => {
          console.log(this.response);
          if (this.response.errorCode != "0") {
            this.toastrService.warning(
              "Unlock User Failed: " + this.response.errorMessage,
              "Unlock User",
              {
                status: "danger",
                destroyByClick: true,
                duration: 100000,
              }
            );
          } else {
            this.toastrService.success("Unlock User Success", "Unlock User", {
              status: "success",
              destroyByClick: true,
              duration: 100000,
            });
            this.ref.close();
          }
        }
      );
  }
}
