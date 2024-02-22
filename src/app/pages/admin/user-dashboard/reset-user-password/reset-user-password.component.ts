import { Component, Input } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { NecService } from "../../../../@core/mock/nec.service";

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
  styleUrls: ["reset-user-password.component.scss"],
})
export class ResetUserPasswordComponent {
  @Input() title: string;
  @Input() batchId: string;
  @Input() submittedBy: string;
  response: any;
  constructor(
    protected ref: NbDialogRef<ResetUserPasswordComponent>,
    public service: NecService
  ) {}

  dismiss() {
    this.ref.close();
  }
  submit() {
    this.response = this.service.resetUserPassword({
      email: "asalia@ghipss.com",
      createdBy: "asalia@ghipss.com",
    });
    console.log(this.response);
    this.ref.close();
  }
}
