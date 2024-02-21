import { Component, OnInit } from "@angular/core";
import { NbWindowRef } from "@nebular/theme";
import { SingleNECService } from "../single.service";
import { FormGroup, FormControl } from "@angular/forms";
import { Validators } from "@angular/forms";
import {
  NbComponentShape,
  NbComponentStatus,
} from "@nebular/theme";

@Component({
  template: `
    <form class="form" [formGroup]="form" (ngSubmit)="onSubmit()">
      <label for="subject">Destination Account:</label>
      <input
        nbInput
        fullWidth
        formControlName="destAccount"
        id="subject"
        type="text"
      />
      <label class="text-label" for="text">Banks/FI:</label>
      <nb-select
        fullWidth
        formControlName="bank"
        [(selected)]="bankList"
        placeholder="Banks/FI"
      >
        <nb-option *ngFor="let i of this.bankList" [value]="i.bankCode">
          {{ i.bankName }}
        </nb-option>
      </nb-select>
      <br />
      <button
        nbButton
        type="submit"
        [status]="statuses[0]"
        (click)="onSubmit()"
        [shape]="shapes[1]"
      >
        Submit
      </button>
    </form>
  `,
  styleUrls: ["single-nec-request.component.scss"],
})
export class SingleNECRequestComponent {
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
  bankList: any;
  constructor(
    public windowRef: NbWindowRef,
    private service: SingleNECService
  ) {}
  ngOnInit(): void {
    // Initialize the form model with three form controls
    this.form = new FormGroup({
      destAccount: new FormControl("", Validators.required),
      bank: new FormControl("", Validators.required),
    });
    this.service.getBanks().subscribe(
      (data) => {
        this.bankList = data;
        console.log(this.bankList);
      },
      (error) => {
        console.log(error);
      },
      () => {
        console.log(this.bankList);
      }
    );
  }
  onSubmit(): void {
    this.object = {
      destAccount: this.form.value.destAccount,
      bank: this.form.value.bank,
      createdBy: "asalia@ghipss.com",
    };
    this.service.makeSingleNECRequest(this.object);
    this.close();
  }
  close() {
    this.windowRef.close();
  }
}
