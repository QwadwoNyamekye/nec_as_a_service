import { Component, Input, OnInit } from "@angular/core";
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
        <button
          nbButton
          hero
          status="success"
          (click)="submit()"
          [nbSpinner]="loading"
          nbSpinnerStatus="danger"
          [disabled]="loading"
        >
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
export class AuthorizeInstitutionUserComponent implements OnInit {
  @Input() title: string;
  @Input() data: any;
  loading: boolean = false;
  response: any;

  constructor(
    protected ref: NbDialogRef<AuthorizeInstitutionUserComponent>,
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
      .authorizeUser({
        email: this.data.email,
        createdBy: this.necService.user.email,
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
