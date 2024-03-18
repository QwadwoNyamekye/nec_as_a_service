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
        <button nbButton hero status="success" (click)="submit()" 
        [nbSpinner]="loading" nbSpinnerStatus="danger"
        [disabled]="loading">
          Accept
        </button>
        <button nbButton hero status="danger" (click)="dismiss()">
          Dismiss
        </button>
      </nb-card-body>
    </nb-card>
  `,
  styleUrls: ["submit-for-authorization.component.scss"],
})
export class SubmitForAuthorizationComponent implements OnInit {
  @Input() title: string;
  @Input() batchId: string;
  @Input() submittedBy: string;
  response: any;
  loading: boolean = false;
  constructor(
    protected ref: NbDialogRef<SubmitForAuthorizationComponent>,
    public service: NecService,
    private toastrService: NbToastrService
  ) {}
  ngOnInit(): void {
    // this.service.initializeWebSocketConnection();
  }
  submit() {
    this.loading = true;
    this.service
      .submitForAuthorization(this.batchId, this.service.user.email)
      .subscribe(
        (data) => {
          this.response = data;
        },
        (error) => {
          this.loading = false;
          console.log(error);
        },
        () => {
          this.loading = false;
          console.log(this.response);
          if (this.response.errorCode != "0") {
            this.toastrService.warning(
              "File Authorization Failed: " + this.response.errorMessage,
              "Bulk File Authorization",
              {
                status: "danger",
                destroyByClick: true,
                duration: 8000,
              }
            );
          } else {
            this.toastrService.success(
              "File Authorization Success",
              "File Authorization",
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
