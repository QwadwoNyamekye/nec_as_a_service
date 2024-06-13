import { Component, OnInit } from "@angular/core";
import { NbWindowRef } from "@nebular/theme";
import { NecService } from "../../../../@core/mock/nec.service";
import { FormGroup, FormControl } from "@angular/forms";
import { Validators } from "@angular/forms";
import { NbToastrService } from "@nebular/theme";

@Component({
  template: `
    <form class="form" [formGroup]="form" (ngSubmit)="onSubmit()">
      <label class="text-label" for="subject">Name:</label>
      <input
        nbInput
        fullWidth
        formControlName="name"
        id="subject"
        type="text"
      />
      <label class="text-label" for="subject">Phone Number:</label>
      <input
        nbInput
        fullWidth
        formControlName="phone"
        id="subject"
        type="text"
        maxlength="12"
      />
      <label class="text-label" for="subject">Fee:</label>
      <input
        nbInput
        fullWidth
        formControlName="fee"
        id="subject"
        type="number"
      />
      <div *ngIf="this.necService.user.type == 'G'">
        <label class="text-label" for="subject">{{ this.label }} Code:</label>
        <input
          nbInput
          fullWidth
          formControlName="code"
          id="subject"
          type="text"
        />
      </div>
      <br />
      <button
        nbButton
        [disabled]="!form.valid"
        id="button"
        type="submit"
        status="primary"
        shape="semi-round"
      >
        Submit
      </button>
    </form>
  `,
  styleUrls: ["add-institution-form.component.scss"],
})
export class AddInstitutionFormComponent implements OnInit {
  institution_data: any;
  items: any;
  form: FormGroup;
  object: any;
  response: any;
  label = this.getLabel();
  code: any;

  getLabel() {
    if (this.necService.user.type == "G") {
      this.code = "";
      return "Bank";
    } else if (this.necService.user.type == "B") {
      this.code = " ";
      return "Corporate";
    }
  }

  constructor(
    public windowRef: NbWindowRef,
    protected necService: NecService,
    private toastrService: NbToastrService
  ) {}

  ngOnInit(): void {
    // Initialize the form model with three form controls
    this.form = new FormGroup({
      name: new FormControl("", Validators.required),
      phone: new FormControl("", [
        Validators.required,
        Validators.pattern("[0-9]{1,12}"),
      ]),
      fee: new FormControl(0, Validators.required),
      code: new FormControl(this.code, Validators.required),
    });
  }

  getType() {
    var type = this.necService.user.type;
    if (type == "G") {
      return "B";
    } else if (type == "B" || type == "C") {
      return "C";
    }
  }

  onSubmit(): void {
    this.object = {
      name: this.form.value.name,
      phone: this.form.value.phone,
      createdBy: this.necService.user.email,
      fee: this.form.value.fee,
      type: this.getType(),
      bank: this.necService.user.institutionCode,
      code: this.form.value.code,
    };
    this.necService.addInstitution(this.object).subscribe(
      (response) => {
        this.response = response;
        // window.parent.postMessage(this.service.getInstitutions());
        return response;
      },
      (error) => {
        this.toastrService.warning(
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
          this.toastrService.warning(
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
          this.windowRef.close();
        }
      }
    );
  }

  close() {
    this.windowRef.close();
  }
}
