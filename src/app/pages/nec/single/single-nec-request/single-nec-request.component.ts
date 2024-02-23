import { Component, Output , OnInit} from "@angular/core";
import { NbWindowRef } from "@nebular/theme";
import { NecService } from "../../../../@core/mock/nec.service";
import { FormGroup, FormControl } from "@angular/forms";
import { Validators } from "@angular/forms";
import { EventEmitter } from "@angular/core";
import { NbComponentShape, NbComponentStatus } from "@nebular/theme";

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
      <nb-select fullWidth formControlName="destBank" placeholder="Banks/FI">
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
  @Output() newItemEvent = new EventEmitter<any>();
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
  constructor(public windowRef: NbWindowRef, private service: NecService) {}
  
  ngOnInit(): void {
    // Initialize the form model with three form controls
    this.form = new FormGroup({
      destAccount: new FormControl("", Validators.required),
      destBank: new FormControl("", Validators.required),
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
      // this.service.initializeWebSocketConnection();
    
  }
  onSubmit(): void {
    this.object = {
      destAccount: this.form.value.destAccount,
      destBank: this.form.value.destBank,
      createdBy: this.service.user.email,
    };
     this.service.makeSingleNECRequest(this.object).subscribe(
      (response) => {
        console.log("========================");
        console.log(response);
        window.parent.postMessage(response);
        return response;
      },
      (error) => console.error(error)
    );
    this.close();
  }
  close() {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@");
    this.windowRef.close();
  }
}