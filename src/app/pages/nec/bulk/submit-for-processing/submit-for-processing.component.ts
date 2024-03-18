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
  styleUrls: ["submit-for-processing.component.scss"],
})
export class SubmitForProcessingComponent implements OnInit {
  @Input() title: string;
  @Input() batchId: string;
  @Input() submittedBy: string;
  response: any;
  loading: boolean = false;
  constructor(
    protected ref: NbDialogRef<SubmitForProcessingComponent>,
    public service: NecService,
    private toastrService: NbToastrService
  ) {}
  ngOnInit(): void {
    // this.service.initializeWebSocketConnection();
  }
  submit() {
    this.loading = true;
    this.service
      .submitForProcessing(this.batchId, this.service.user.email)
      .subscribe(
        (data) => {
          this.loading = true;
          this.response = data;
          console.log(this.response);
          if (this.response.errorCode != "0") {
            this.toastrService.warning(
              "File Processing Failed: " + this.response.errorMessage,
              "Bulk File Processing",
              {
                status: "danger",
                destroyByClick: true,
                duration: 8000,
              }
            );
          } else {
            this.toastrService.success(
              "File Processing Success: " + this.response.errorMessage,
              "File Processing",
              { status: "success", destroyByClick: true, duration: 8000 }
            );
          }
        },
        (error) => {
          this.loading = false;
          console.log(error);
        },
        () => {
          this.loading = false;
          console.log("AAAAAAAAAAAAAAAAAAAAAAA");
          this.ref.close();
        }
      );
  }
  dismiss() {
    this.ref.close();
  }
}
