import { Component, OnInit } from "@angular/core";
import { NbWindowRef } from "@nebular/theme";
import { NecService } from "../../../../@core/mock/nec.service";
import { FormGroup, FormControl } from "@angular/forms";
import { Validators } from "@angular/forms";
import {
  NbComponentShape,
  NbComponentSize,
  NbComponentStatus,
} from "@nebular/theme";
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
        type="tel"
        pattern="\d{1,12}"
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
      <br />
      <button
        nbButton
        [disabled]="!form.valid"
        id="button"
        type="submit"
        [status]="statuses[0]"
        [shape]="shapes[2]"
      >
        Submit
      </button>
    </form>
  `,
  styleUrls: ["add-institution-form.component.scss"],
})
export class AddInstitutionFormComponent implements OnInit {
  statuses: NbComponentStatus[] = [
    "primary",
    "success",
    "info",
    "warning",
    "danger",
  ];
  shapes: NbComponentShape[] = ["rectangle", "semi-round", "round"];
  institution_data: any;
  items: any;
  form: FormGroup;
  object: any;
  response: any;
  constructor(
    public windowRef: NbWindowRef,
    private service: NecService,
    private toastrService: NbToastrService
  ) {}

  ngOnInit(): void {
    // Initialize the form model with three form controls
    this.form = new FormGroup({
      name: new FormControl("", Validators.required),
      phone: new FormControl("", Validators.required),
      fee: new FormControl(0, Validators.required),
    });
  }

  onSubmit(): void {
    this.object = {
      name: this.form.value.name,
      phone: this.form.value.phone,
      createdBy: this.service.user.email,
      fee: this.form.value.fee,
    };
    this.service.addInstitution(this.object).subscribe(
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
