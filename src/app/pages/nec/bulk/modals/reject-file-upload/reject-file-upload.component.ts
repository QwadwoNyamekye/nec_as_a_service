import { Component, Input, OnInit } from "@angular/core";
import { NbDialogRef, NbToastrService } from "@nebular/theme";
import { NecService } from "../../../../../@core/mock/nec.service";

@Component({
  selector: `ngx-user-edit-modal`,
  template: `
    <nb-card>
      <nb-card-header
        ><div class="text-center">{{ title }}</div></nb-card-header
      >
      <nb-card-body>
        <button nbButton hero status="success" (click)="submit()">
          Reject
        </button>
        <button nbButton hero status="danger" (click)="dismiss()">
          Dismiss
        </button>
      </nb-card-body>
    </nb-card>
  `,
  styleUrls: ["reject-file-upload.component.scss"],
})
export class RejectFileUploadComponent implements OnInit {
  @Input() title: string;
  @Input() batchId: string;
  @Input() submittedBy: string;
  response: any;
  constructor(
    protected ref: NbDialogRef<RejectFileUploadComponent>,
    public necService: NecService,
    private toastrService: NbToastrService
  ) {}

  ngOnInit() {}

  submit() {
    this.necService
      .rejectUploadedFile(this.batchId, this.necService.user.email)
      .subscribe(
        (data) => {
          this.response = data;
          if (this.response.errorCode != "0") {
            this.toastrService.danger(
              "Uploaded File Status Change: REJECT Failed: " +
                this.response.errorMessage,
              "Bulk File Processing",
              {
                status: "danger",
                destroyByClick: true,
                duration: 8000,
              }
            );
          } else {
            this.toastrService.success(
              "Uploaded File Status Change: REJECT Success: " +
                this.response.errorMessage,
              "File Processing",
              { status: "success", destroyByClick: true, duration: 8000 }
            );
          }
        },
        (error) => {},
        () => {
          this.ref.close();
        }
      );
  }
  dismiss() {
    this.ref.close();
  }
}
