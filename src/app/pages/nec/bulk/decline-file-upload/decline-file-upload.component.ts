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
        <button nbButton hero status="success" (click)="submit()">Decline</button>
        <button nbButton hero status="danger" (click)="dismiss()">
          Dismiss
        </button>
      </nb-card-body>
    </nb-card>
  `,
  styleUrls: ["decline-file-upload.component.scss"],
})
export class DeclineFileUploadComponent implements OnInit {
  @Input() title: string;
  @Input() batchId: string;
  @Input() submittedBy: string;
  response: any;
  constructor(
    protected ref: NbDialogRef<DeclineFileUploadComponent>,
    public service: NecService,
    private toastrService: NbToastrService
  ) {}
  ngOnInit(): void {
    // this.service.initializeWebSocketConnection();
  }
  submit() {
    this.service
      .declineUploadedFile(this.batchId, this.service.user.email)
      .subscribe(
        (data) => {
          this.response = data;
          if (this.response.errorCode != "0") {
            this.toastrService.warning(
              "Uploaded File Status Change: DENY Failed: " +
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
              "Uploaded File Status Change: DENY Success: " +
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
