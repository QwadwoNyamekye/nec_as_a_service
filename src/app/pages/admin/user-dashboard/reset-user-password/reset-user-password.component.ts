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
  styleUrls: ["reset-user-password.component.scss"],
})
export class ResetUserPasswordComponent implements OnInit {
  @Input() title: string;
  @Input() batchId: string;
  @Input() submittedBy: string;
  @Input() email: string;
  response: any;
  constructor(
    protected ref: NbDialogRef<ResetUserPasswordComponent>,
    public service: NecService
  ) {}
  ngOnInit(): void {
    // this.service.initializeWebSocketConnection();
  }
  dismiss() {
    this.ref.close();
  }
  submit() {
    this.response = this.service
      .resetUserPassword({
        email: this.email,
        createdBy: this.service.user.email,
      })
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => console.error(error)
      );
    console.log(this.response);
    this.ref.close();
  }
}
