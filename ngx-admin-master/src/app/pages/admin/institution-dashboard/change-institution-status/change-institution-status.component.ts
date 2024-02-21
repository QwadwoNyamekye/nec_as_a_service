import { Component, Input } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { InstitutionDashboardService } from "../institution-dashboard.service";

@Component({
  selector: `ngx-user-edit-modal`,
  template: `
    <nb-card>
      <nb-card-header
        ><div class="text-center">{{ title }}</div></nb-card-header
      >
      <nb-card-body>
        <button nbButton hero status="success" (click)="submit($event)">
          Disable
        </button>
        <button nbButton hero status="danger" (click)="dismiss()">
          Dismiss
        </button>
      </nb-card-body>
    </nb-card>
  `,
  styleUrls: ["change-institution-status.component.scss"],
})
export class ChangeInstitutionStatusComponent {
  @Input() title: string;
  @Input() batchId: string;
  @Input() submittedBy: string;
  response: any;
  constructor(
    protected ref: NbDialogRef<ChangeInstitutionStatusComponent>,
    public service: InstitutionDashboardService
  ) {}

  dismiss() {
    this.ref.close();
  }
  submit(event) {
    console.log("+++++++")
    console.log(event)
    this.response = this.service.changeInstitutionStatus(
      {
        "code":event.data.code,
        "status":event.data.code
      }
    );
    console.log(this.response);
    this.ref.close();
  }
}
