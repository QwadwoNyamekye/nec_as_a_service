import { Component, OnInit } from "@angular/core";
import { NbWindowRef } from "@nebular/theme";
import { NecService } from "../../../../@core/mock/nec.service";
import { FormGroup, FormControl } from "@angular/forms";
import { Validators } from "@angular/forms";
import { NbComponentShape, NbComponentSize, NbComponentStatus } from '@nebular/theme';


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
      <label class="text-label" for="subject">Phone:</label>
      <input
        nbInput
        fullWidth
        formControlName="phone"
        id="subject"
        type="text"
      />
      <label class="text-label" for="subject">Created By:</label>
      <input
        nbInput
        fullWidth
        formControlName="createdBy"
        id="subject"
        type="text"
      />
      <br />
      <button
        nbButton
        [disabled]="!form.valid"
        id="button"
        type="submit"
        [status]=statuses[0]
        [shape]=shapes[1]
        (click)="onSubmit()"
      >
        Submit
      </button>
    </form>
  `,
  styleUrls: ["add-institution-form.component.scss"],
})
export class AddInstitutionFormComponent {
  statuses: NbComponentStatus[] = [
    "primary",
    "success",
    "info",
    "warning",
    "danger",
  ];  
  shapes: NbComponentShape[] = [ 'rectangle', 'semi-round', 'round' ];
  institution_data: any;
  items: any;
  form: FormGroup;
  object: any;
  constructor(
    public windowRef: NbWindowRef,
    private service: NecService
  ) {}
  ngOnInit(): void {
    // Initialize the form model with three form controls
    this.form = new FormGroup({
      name: new FormControl("", Validators.required),
      phone: new FormControl("", Validators.required),
      createdBy: new FormControl("", Validators.required),
    });
  }

  onSubmit(): void {
    this.object = {
      name: this.form.value.name,
      phone: this.form.value.phone,
      createdBy: this.form.value.createdBy,
    };
    this.service.addInstitution(this.object);
    this.close();
  }
  close() {
    this.windowRef.close();
  }
}
