import { Component, Input } from "@angular/core";
import { NbDialogRef, NbToastrService } from "@nebular/theme";
import { NecService } from "../../../../@core/mock/nec.service";

@Component({
  selector: `ngx-user-edit-modal`,
  template: `
    <nb-card>
      <nb-card-header
        ><div class="text-center">
          {{ "Delete User: " + currentValues?.name }}
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
  @Input() currentValues: any;
  response: any;
  loading: boolean = false;

  constructor(
    protected ref: NbDialogRef<DeleteUserComponent>,
    public necService: NecService,
    private toastrService: NbToastrService
  ) {}

  dismiss() {
    this.ref.close();
  }

  submit() {
    this.loading = true;
    this.response = this.necService
      .deleteUser({
        email: this.currentValues.email,
        createdBy: this.necService.user.email,
      })
      .subscribe(
        (response) => {
          this.response = response;
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.toastrService.danger(
            this.currentValues.name +
              " Deletion Failed: " +
              error.error.errorMessage,
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
            this.toastrService.danger(
              this.currentValues.name +
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
              this.currentValues.name + " Successfully Deleted",
              "Delete User",
              { status: "success", destroyByClick: true, duration: 8000 }
            );
            this.dismiss();
          }
        }
      );
  }
}
