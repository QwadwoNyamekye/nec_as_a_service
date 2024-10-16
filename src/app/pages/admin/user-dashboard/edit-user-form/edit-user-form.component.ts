import { Component, Input, OnInit } from "@angular/core";
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
      />

      <label class="text-label" for="text">Username:</label>
      <input
        nbInput
        fullWidth
        formControlName="username"
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
        [disabled]="!form.valid"
        id="button"
        type="submit"
        class="button"
        status="primary"
        shape="round"
      >
        Submit
      </button>
    </form>
  `,
  styleUrls: ["edit-user-form.component.scss"],
})
export class EditUserFormComponent implements OnInit {
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

  constructor(
    public windowRef: NbWindowRef,
    private necService: NecService,
    private toastrService: NbToastrService
  ) {}

  ngOnInit(): void {
    console.log("****************************")
    this.name = this.currentValues.name.split(" ");
    this.necService.getInstitutions().subscribe(
      (data) => {
        this.institutions = data;
      },
      (error) => {}
    );

    this.necService.getRoles().subscribe(
      (data) => {
        this.roles = data;
        if (this.necService.user.roleId == "1") {
          this.roles = this.roles.filter(
            (role) =>
              !role.name.includes("Bank") && !role.name.includes("Corporate")
          );
        } else if (this.necService.user.roleId == "2") {
          this.roles = this.roles.filter((role) => role.name.includes("Bank"));
        }
      },
      (error) => {}
    );
    
    this.form = new FormGroup({
      firstName: new FormControl(this.name[0], Validators.required),
      lastName: new FormControl(this.name[1], Validators.required),
      // username: new FormControl(this.name, Validators.required),
      institution: new FormControl(
        this.currentValues.institutionCode,
        Validators.required
      ),
      role: new FormControl(this.currentValues.roleId, Validators.required),
      phone: new FormControl(this.currentValues.phone),
      // emailAddress: new FormControl("", Validators.required),
    });
    // this.currentRole = this.currentValues.roleName
  }
  getType() {
    var type = this.necService.user.type;
    if (type == "G") {
      return "B";
    } else if (type == "B" || type == "C") {
      return "C";
    }
  }
  // Define a method to handle the form submission
  onSubmit(): void {
    this.currentValues.name =
      this.form.value.firstName + " " + this.form.value.lastName;
    this.currentValues.institutionCode = this.form.value.institution;
    this.currentValues.roleId = this.form.value.role;
    this.currentValues.phone = this.form.value.phone;
    this.currentValues.createdBy = this.necService.user.email;
    // Send a post request to the server endpoint with the FormData object
    this.necService.editUser(this.currentValues).subscribe(
      (response) => {
        this.response = response;
        // window.parent.postMessage(this.necService.getUsers());
      },
      (error) => {
        this.toastrService.danger(
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
        if (this.response.errorCode != "0") {
          this.toastrService.danger(
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
          console.log("+++++++++++++++++")
          this.windowRef.close();
        }
      }
    );
  }

  close() {
    this.windowRef.close();
  }
}
