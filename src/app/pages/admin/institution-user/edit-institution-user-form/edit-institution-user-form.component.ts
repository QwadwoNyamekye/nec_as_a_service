import { Component, OnInit, Input } from "@angular/core";
import { NbWindowRef } from "@nebular/theme";
import { NecService } from "../../../../@core/mock/nec.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { LocalDataSource } from "ng2-smart-table";
import { NbToastrService } from "@nebular/theme";

@Component({
  template: `
    <form class="form" [formGroup]="form" (ngSubmit)="onSubmit()">
      <label for="text">First Name:</label>
      <input
        nbInput
        fullWidth
        formControlName="firstName"
        id="subject"
        type="text"
        placeholder="First Name"
      />

      <label class="text-label" for="text">Last Name:</label>
      <input
        nbInput
        fullWidth
        formControlName="lastName"
        id="text"
        type="text"
      />
      <label class="text-label" for="text">Phone Number:</label>
      <input
        nbInput
        fullWidth
        formControlName="phone"
        id="text"
        type="tel"
        pattern="[0-9]{1,12}"
        maxlength="12"
      />

      <div class="row">
        <div class="col-sm-6">
          <label class="text-label" for="text">Institution:</label>
          <nb-select fullWidth formControlName="institution">
            <nb-option *ngFor="let i of this.institutions" [value]="i.code">
              {{ i.name }}
            </nb-option>
          </nb-select>
        </div>
        <div class="col-sm-6">
          <label class="text-label" for="text">Roles:</label>
          <nb-select fullWidth formControlName="role">
            <nb-option *ngFor="let i of this.roles" [value]="i.id">
              {{ i.name }}
            </nb-option>
          </nb-select>
        </div>
      </div>

      <br />
      <button
        nbButton
        [disabled]="!form.valid || loading"
        id="button"
        type="submit"
        class="button"
        status="primary"
        shape="semi-round"
        [nbSpinner]="loading"
        nbSpinnerStatus="danger"
      >
        Submit
      </button>
    </form>
  `,
  styleUrls: ["edit-institution-user-form.component.scss"],
})
export class EditInstitutionUserFormComponent implements OnInit {
  @Input() currentValues: any;
  items: any;
  form: FormGroup;
  selectedOption: any;
  institutions: any = [];
  roles: any = [];
  selectedItems: any;
  selectedRoles: any;
  source: LocalDataSource = new LocalDataSource();
  response: any;
  name: any;
  loading: boolean = false;

  constructor(
    public windowRef: NbWindowRef,
    private necService: NecService,
    private toastrService: NbToastrService
  ) {}

  ngOnInit(): void {
    this.name = this.currentValues.name.split(" ");
    this.necService
      .getInstitutionsByBank(this.necService.user.institutionCode)
      .subscribe(
        (data) => {
          this.institutions = data;
          if (this.necService.user.roleId == "1") {
            this.institutions = this.institutions.filter(
              (institution) => !institution.code.includes("INS-NEC-0000")
            );
          }
        },
        () => {}
      );

    this.necService.getRoles().subscribe(
      (data) => {
        this.roles = data;
        if (this.necService.user.roleId == "1") {
          this.roles = this.roles.filter((role) =>
            role.name.includes("Bank Administrator")
          );
        } else if (this.necService.user.roleId == "2") {
          this.roles = this.roles.filter((role) =>
            role.name.includes("Corporate")
          );
        }
      },
      () => {}
    );
    this.form = new FormGroup({
      firstName: new FormControl(this.name[0], Validators.required),
      lastName: new FormControl(this.name[1], Validators.required),
      institution: new FormControl(
        this.currentValues.institutionCode,
        Validators.required
      ),
      role: new FormControl(this.currentValues.roleId, Validators.required),
      phone: new FormControl(this.currentValues.phone, Validators.required),
      // emailAddress: new FormControl("", Validators.required),
    });
    // this.currentRole = this.currentValues.roleName
  }

  // Define a method to handle the form submission
  onSubmit(): void {
    this.loading = true;
    this.currentValues.name =
      this.form.value.firstName + " " + this.form.value.lastName;
    this.currentValues.institutionCode = this.form.value.institution;
    this.currentValues.roleId = this.form.value.role;
    this.currentValues.phone = this.form.value.phone;
    this.currentValues.createdBy = this.necService.user.email;
    (this.currentValues.bankCode = this.necService.user.institutionCode),
      // Send a post request to the server endpoint with the FormData object
      this.necService.editUser(this.currentValues).subscribe(
        (response) => {
          this.response = response;
          // window.parent.postMessage(this.necService.getUsers());
        },
        (error) => {
          this.loading = false;
          this.toastrService.warning(
            "User Edit Failed: " + error.error.errorMessage,
            "User Edit",
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
            this.toastrService.warning(
              "User Edit Failed: " + this.response.errorMessage,
              "User Edit",
              {
                status: "danger",
                destroyByClick: true,
                duration: 8000,
              }
            );
          } else {
            this.toastrService.success("User Edit Success", "User Edit", {
              status: "success",
              destroyByClick: true,
              duration: 8000,
            });
            this.windowRef.close();
          }
        }
      );
  }

  close() {
    this.windowRef.close();
  }
}
