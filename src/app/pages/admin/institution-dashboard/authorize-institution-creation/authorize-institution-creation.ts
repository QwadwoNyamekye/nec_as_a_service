import { Component, Input, OnInit } from "@angular/core";
import { NbDialogRef, NbToastrService } from "@nebular/theme";
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
  styleUrls: ["authorize-institution-creation.scss"],
})
export class AuthorizeInstutionCreationComponent implements OnInit {
  @Input() title: string;
  @Input() authorized: boolean;
  @Input() code: string;
  action: any;
  response: any;

  constructor(
    protected ref: NbDialogRef<AuthorizeInstutionCreationComponent>,
    public necService: NecService,
    private toastrService: NbToastrService
  ) {}

  ngOnInit(): void {
    if (this.authorized) {
      // this.action = "Reject";
      this.ref.close();
      this.toastrService.success(
        "Institution Already Authorized",
        "Institution Creation",
        { status: "success", destroyByClick: true, duration: 8000 }
      );
    } else {
      this.action = "Authorize";
    }
  }

  submit(event) {
    this.response = this.necService
      .authorizeInstitution({
        code: this.code,
        authorized: !this.authorized,
        createdBy: this.necService.user.email,
      })
      .subscribe(
        (response) => {
          this.response = response;
          // window.parent.postMessage(this.service.getInstitutions());
          return response;
        },
        (error) => {
          this.toastrService.danger(
            "Institution Creation Failed: " + error.error.errorMessage,
            "Institution Creation",
            {
              status: "danger",
              destroyByClick: true,
              duration: 8000,
            }
          );
        },
        () => {
          if (this.response.errorCode != "0") {
            this.toastrService.danger(
              "Institution Creation Failed: " + this.response.errorMessage,
              "Institution Creation",
              {
                status: "danger",
                destroyByClick: true,
                duration: 8000,
              }
            );
          } else {
            this.toastrService.success(
              "Institution Creation Success",
              "Institution Creation",
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
