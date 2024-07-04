import { Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NbToastrService, NbWindowRef } from "@nebular/theme";
import { NecService } from "../../../../@core/mock/nec.service";

@Component({
  selector: `ngx-user-edit-modal`,
  template: `
    <form class="form" [formGroup]="form" (ngSubmit)="submitInstitutionEdit()">
      <label for="text">Name:</label>
      <input
        nbInput
        fullWidth
        formControlName="name"
        id="subject"
        type="text"
        placeholder="Name"
      />
      <label class="text-label" for="text">Status:</label>
      <nb-select fullWidth formControlName="status" placeholder="Status">
        <nb-option *ngFor="let i of this.institutionStatuses" [value]="i.value">
          {{ i.key }}
        </nb-option>
      </nb-select>

      <label class="text-label" for="text">Phone Number:</label>
      <input
        nbInput
        fullWidth
        formControlName="phone"
        id="text"
        type="text"
        maxlength="12"
        placeholder="Phone Number"
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
        [disabled]="!form.valid || loading"
        id="button"
        type="submit"
        class="button"
        status="primary"
        shape="round"
        [nbSpinner]="loading"
        nbSpinnerStatus="danger"
      >
        Submit
      </button>
    </form>
  `,
  styleUrls: ["edit-institution-form.component.scss"],
})
export class EditInstitutionFormComponent implements OnInit {
  @Input() currentValues: any;
  form: FormGroup;
  institutionStatuses: any = [
    { key: "ENABLE", value: true },
    { key: "DISABLE", value: false },
  ];
  response: any;
  loading: boolean = false;

  constructor(
    public windowRef: NbWindowRef,
    private necService: NecService,
    private toastrService: NbToastrService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(this.currentValues.name, Validators.required),
      status: new FormControl(this.currentValues.status, [Validators.required]),
      phone: new FormControl(
        this.currentValues.phone,
        Validators.pattern("[0-9]{1,12}")
      ),
      fee: new FormControl(this.currentValues.fee, Validators.required),
    });
  }

  submitInstitutionEdit(): void {
    this.loading = true;
    var object = {
      name: this.form.value.name,
      status: this.form.value.status,
      phone: this.form.value.phone,
      fee: this.form.value.fee,
      code: this.currentValues.code,
      type: this.currentValues.type,
      bank: this.currentValues.bankCode,
    };
    // Send a post request to the server endpoint with the FormData object
    this.necService.editInstitution(object).subscribe(
      (response) => {
        this.response = response;
      },
      (error) => {
        this.loading = false;
        this.toastrService.danger(
          "Institution Edit Failed: " + error.error.errorMessage,
          "Institution Edit",
          {
            status: "danger",
            destroyByClick: true,
            duration: 8000,
          }
        );
      },
      () => {
        this.loading = false;
        if (this.response.errorCode != "0") {
          this.toastrService.danger(
            "Institution Edit Failed: " + this.response.errorMessage,
            "Institution Edit",
            {
              status: "danger",
              destroyByClick: true,
              duration: 8000,
            }
          );
        } else {
          this.toastrService.success(
            "Institution Edit Success",
            "Institution Edit",
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
