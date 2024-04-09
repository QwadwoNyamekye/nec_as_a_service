import { Component, Input } from "@angular/core";
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
          Delete
        </button>
        <button nbButton hero status="danger" (click)="dismiss()">
          Dismiss
        </button>
      </nb-card-body>
    </nb-card>
  `,
  styleUrls: ["delete-user.component.scss"],
})
export class DeleteUserComponent {
  @Input() title: string;
  @Input() batchId: string;
  @Input() submittedBy: string;
  @Input() data: any;

  response: any;

  constructor(
    protected ref: NbDialogRef<DeleteUserComponent>,
    public service: NecService,
    private toastrService: NbToastrService
  ) {}

  dismiss() {
    this.ref.close();
  }

  submit() {
    this.response = this.service
      .deleteUser({
        email: this.data.email,
        createdBy: this.service.user.email,
      })
      .subscribe(
        (response) => {
          this.response = response;
        },
        (error) => {
          console.error(error);
          this.toastrService.warning(
            this.data.name + " Deletion Failed: " + error.error.errorMessage,
            "Delete User",
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
              this.data.name +
                " Deletion Failed: " +
                this.response.errorMessage,
              "Delete User",
              {
                status: "danger",
                destroyByClick: true,
                duration: 8000,
              }
            );
          } else {
            this.toastrService.success(
              this.data.name + " Successfully Deleted",
              "Delete User",
              { status: "success", destroyByClick: true, duration: 8000 }
            );
            this.dismiss();
          }
        }
      );
  }
}
