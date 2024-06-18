import { Component, EventEmitter, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NbToastrService, NbWindowRef } from "@nebular/theme";
import { NecService } from "../../../../@core/mock/nec.service";

@Component({
  template: `
    <form class="form" [formGroup]="form">
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
        status="primary"
        (click)="onSubmit()"
        shape="round"
        [nbSpinner]="loading"
        nbSpinnerStatus="danger"
        [disabled]="loading"
      >
        Submit
      </button>
    </form>
  `,
  styleUrls: ["single-nec-request.component.scss"],
})
export class SingleNECRequestComponent {
  @Output() newItemEvent = new EventEmitter<any>();
  institution_data: any;
  items: any;
  form: FormGroup;
  object: any;
  bankList: any;
  response: any;
  loading: boolean = false;
  constructor(
    public windowRef: NbWindowRef,
    private toastrService: NbToastrService,
    private necService: NecService
  ) {}

  ngOnInit(): void {
    // Initialize the form model with three form controls
    this.form = new FormGroup({
      destAccount: new FormControl("", Validators.required),
      destBank: new FormControl("", Validators.required),
    });
    this.necService.getBanks().subscribe(
      (data) => {
        this.bankList = data;
      },
      (error) => {},
      () => {}
    );
  }

  onSubmit(): void {
    this.loading = true;
    this.object = {
      destAccount: this.form.value.destAccount,
      destBank: this.form.value.destBank,
      createdBy: this.necService.user.email,
    };
    this.necService.makeSingleNECRequest(this.object).subscribe(
      (response: any) => {
        if (response.errorCode == "0") {
          this.response = response;
          this.toastrService.success(
            "Single NEC Request Success",
            "Single NEC Request",
            {
              status: "success",
              destroyByClick: true,
              duration: 8000,
            }
          );
        } else {
          this.toastrService.warning(
            "Single NEC Request Failed: " + response.errorMessage,
            "Single NEC Request",
            {
              status: "danger",
              destroyByClick: true,
              duration: 8000,
            }
          );
        }
        return response;
        // window.parent.postMessage(response);
      },
      (error) => {
        this.loading = false;
        this.toastrService.warning(
          "Single NEC Request Failed: " + error.error.errorMessage,
          "Single NEC Request",
          {
            status: "danger",
            destroyByClick: true,
            duration: 8000,
          }
        );
      },
      () => {
        this.loading = false;
        this.windowRef.close();
      }
    );
  }
  close() {
    this.windowRef.close();
  }
}
