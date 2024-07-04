import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NbToastrService, NbWindowRef } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { NecService } from "../../../../@core/mock/nec.service";

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
        placeholder="Last Name"
      />

      <div class="row">
        <div class="col">
          <label class="text-label" for="text">{{ this.label }}:</label>
          <nb-select
            fullWidth
            formControlName="institution"
            [(selected)]="selectedItems"
            placeholder="{{ this.label }}"
          >
            <nb-option *ngFor="let i of this.institutions" [value]="i.code">
              {{ i.name }}
            </nb-option>
          </nb-select>
        </div>
        <div class="col">
          <label class="text-label" for="text">Roles:</label>
          <nb-select fullWidth formControlName="role" placeholder="Role">
            <nb-option *ngFor="let i of this.roles" [value]="i.id">
              {{ i.name }}
            </nb-option>
          </nb-select>
        </div>
      </div>

      <div class="form-control-group">
        <label class="text-label" for="text">Phone Number:</label>
        <input
          nbInput
          fullWidth
          formControlName="phoneNumber"
          id="text"
          type="tel"
          pattern="[0-9]{1,12}"
          maxlength="12"
          placeholder="Phone Number"
        />
      </div>
      <label class="text-label" for="text">Email Address:</label>
      <input
        nbInput
        fullWidth
        formControlName="emailAddress"
        id="text"
        type="email"
        placeholder="Email Address"
      />
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
  styleUrls: ["add-institution-user-form.component.scss"],
})
export class AddInstutionUserFormComponent implements OnInit {
  items: any;
  form: FormGroup;
  selectedOption: any;
  institutions: any = [];
  roles: any = [];
  selectedItems: any;
  selectedRoles: any;
  response: any;
  loading: boolean = false;
  source: LocalDataSource = new LocalDataSource();
  institutionCode: any;
  bankCode: any;
  type: string = this.setType();
  label = this.getLabel();
  object: any;

  getLabel() {
    if (this.necService.user.type == "G") {
      return "Bank";
    } else if (this.necService.user.type == "B") {
      return "Corporate";
    }
  }

  constructor(
    public windowRef: NbWindowRef,
    private necService: NecService,
    private toastrService: NbToastrService
  ) {}

  setType() {
    var userType = this.necService.user.type;
    if (userType == "G") {
      return "B";
    } else if (userType == "B") {
      return "C";
    }
  }

  ngOnInit(): void {
    if (
      this.necService.user.roleId == "2" ||
      this.necService.user.roleId == "3" ||
      this.necService.user.roleId == "4"
    ) {
      this.institutionCode = this.necService.user.institutionCode;
    }

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
        (error) => {}
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
      (error) => {}
    );

    // Initialize the form model with three form controls
    this.form = new FormGroup({
      firstName: new FormControl("", Validators.required),
      lastName: new FormControl("", Validators.required),
      institution: new FormControl("", Validators.required),
      role: new FormControl(this.roles[0], Validators.required),
      emailAddress: new FormControl("", [
        Validators.required,
        Validators.email,
      ]),
      phoneNumber: new FormControl(""),
    });

    if (
      this.necService.user.roleId == "2" ||
      this.necService.user.roleId == "3" ||
      this.necService.user.roleId == "4"
    ) {
      this.form.value.institution = this.necService.user.institutionCode;
      this.form
        .get("institution")
        .patchValue(this.necService.user.institutionCode);
    }
  }

  getType() {
    var type = this.necService.user.type;
    if (type == "G") {
      return "B";
    } else if (type == "B") {
      return "C";
    }
  }
  // Define a method to handle the form submission
  onSubmit(): void {
    this.loading = true;
    this.object = {
      name: this.form.value.firstName + " " + this.form.value.lastName,
      institutionCode: this.form.value.institution,
      bankCode: this.necService.user.institutionCode,
      type: this.getType(),
      roleId: this.form.value.role,
      email: this.form.value.emailAddress,
      phone: this.form.value.phoneNumber,
      createdBy: this.necService.user.email,
    };

    // Send a post request to the server endpoint with the FormData object
    this.necService.postUsers(this.object).subscribe(
      (data) => {
        // window.parent.postMessage(this.necService.getUsers());
        this.response = data;
      },
      (error) => {
        this.loading = false;
        this.toastrService.danger(
          "User Creation Failed: " + error.error.errorMessage,
          "User Creation",
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
            "User Creation Failed: " + this.response.errorMessage,
            "User Creation",
            {
              status: "danger",
              destroyByClick: true,
              duration: 8000,
            }
          );
        } else {
          this.toastrService.success("User Creation Success", "User Creation", {
            status: "success",
            destroyByClick: true,
            duration: 8000,
          });
          this.close();
        }
      }
    );
  }

  close() {
    this.windowRef.close(this.object);
  }
}
