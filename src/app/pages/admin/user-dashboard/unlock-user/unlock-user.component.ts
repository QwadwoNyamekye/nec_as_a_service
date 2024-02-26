import { Component, Input, OnInit } from "@angular/core";
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
  styleUrls: ["unlock-user.component.scss"],
})
export class UnlockUserComponent implements OnInit{
  @Input() title: string;
  @Input() batchId: string;
  @Input() submittedBy: string;
  @Input() email: string;
  response: any;
  constructor(
    protected ref: NbDialogRef<UnlockUserComponent>,
    public service: NecService
  ) {}
  ngOnInit(): void {
    // this.service.initializeWebSocketConnection();
  }
  dismiss() {
    this.ref.close();
  }
  submit() {
    this.response = this.service.unlockUser(
      {
        "email":this.email,
        "createdBy":this.service.user.email
      }
    );
    console.log(this.response);
    this.ref.close();
  }
}
