import { Component, OnInit } from "@angular/core";
import { NbWindowRef } from "@nebular/theme";
import { FormBuilder } from "@angular/forms";
import {
  NbComponentShape,
  NbComponentSize,
  NbComponentStatus,
} from "@nebular/theme";
import { Validators } from "@angular/forms";
import { FormGroup, FormControl } from "@angular/forms";
import { InstitutionDashboardService } from "../institution-dashboard.service";

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
        <nb-option *ngFor="let i of this.institutionStatuses" [value]="i">
          {{ i }}
        </nb-option>
      </nb-select>

      <label class="text-label" for="text">Phone Number:</label>
      <input
        nbInput
        fullWidth
        formControlName="phone"
        id="text"
        type="text"
        placeholder="Phone Number"
      />
      <br />
      <button
        nbButton
        [disabled]="!form.valid"
        id="button"
        type="submit"
        class="button"
        [status]="statuses[0]"
        [shape]="shapes[1]"
      >
        Submit
      </button>
    </form>
  `,
  styleUrls: ["edit-institution-form.component.scss"],
})
export class EditInstitutionFormComponent implements OnInit {
  form: FormGroup;
  constructor(
    public windowRef: NbWindowRef,
    private service: InstitutionDashboardService
  ) {}
  statuses: NbComponentStatus[] = [
    "primary",
    "success",
    "info",
    "warning",
    "danger",
  ];
  shapes: NbComponentShape[] = ["rectangle", "semi-round", "round"];
  institutionStatuses: any[] = [true, false];
  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl("", Validators.required),
      status: new FormControl("", [Validators.required]),
      phone: new FormControl("", Validators.required),
    });
  }
  submitInstitutionEdit(): void {
    var object = {
      name: this.form.value.name,
      status: this.form.value.status,
      phone: this.form.value.phone,
    };
    // Send a post request to the server endpoint with the FormData object
    this.service.editInstitution(object);
  }
  close() {
    this.windowRef.close();
  }
}
