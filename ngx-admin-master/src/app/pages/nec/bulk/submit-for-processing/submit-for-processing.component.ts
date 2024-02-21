import { Component, Input } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { BulkUploadService } from "../bulk.service";
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
  styleUrls: ["submit-for-processing.component.scss"],
})
export class SubmitForProcessingComponent {
  @Input() title: string;
  @Input() batchId: string;
  @Input() submittedBy: string;
  response: any;
  constructor(
    protected ref: NbDialogRef<SubmitForProcessingComponent>,
    public service: BulkUploadService,
    private toastrService: NbToastrService
  ) {}

  dismiss() {
    this.ref.close();
  }
  submit() {
    this.service.submitForProcessing(this.batchId, this.submittedBy).subscribe(
      (data) => {
        this.response = data;
      },
      (error) => {
        console.log(error);
      },
      () => {
        console.log("################");
        console.log(this.response);
        if (this.response.errorCode != "0") {
          this.toastrService.show("File Processing Failed", "File Processing", {
            status: "danger", destroyByClick: true, duration: 200000
          });
        } else {
          this.toastrService.show(
            "File Processing Success",
            "File Processing",
            { status: "success", destroyByClick: true, duration: 200000 }
          );
        }
      }
    );
    this.ref.close();
  }
}
