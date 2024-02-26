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
        <button nbButton hero status="success" (click)="submit($event)">
          {{ action }}
        </button>
        <button nbButton hero status="danger" (click)="dismiss()">
          Dismiss
        </button>
      </nb-card-body>
    </nb-card>
  `,
  styleUrls: ["change-institution-status.component.scss"],
})
export class ChangeInstitutionStatusComponent implements OnInit {
  @Input() title: string;
  @Input() batchId: string;
  @Input() submittedBy: string;
  @Input() status: boolean;
  @Input() code: string;
  action: any;
  response: any;

  constructor(
    protected ref: NbDialogRef<ChangeInstitutionStatusComponent>,
    public service: NecService
  ) {}

  ngOnInit(): void {
    // this.service.initializeWebSocketConnection()
    if (this.status) {
      this.action = "Disable";
    } else {
      this.action = "Enable";
    }
  }

  submit(event) {
    console.log(event);
    this.response = this.service
      .changeInstitutionStatus({
        code: this.code,
        status: !this.status,
        createdBy: this.service.user.email,
      })
      .subscribe(
        (response) => {
          console.log(response);
          window.parent.postMessage(response);
          return response;
        },
        (error) => console.error(error)
      );
    console.log(this.response);
    this.ref.close();
  }

  dismiss() {
    this.ref.close();
  }
}
