import { Component, OnInit } from "@angular/core";
import { NbWindowRef } from "@nebular/theme";
import { NecService } from "../../../../@core/mock/nec.service";
import { FormGroup, FormControl } from "@angular/forms";
import { Validators } from "@angular/forms";
import { LocalDataSource } from "ng2-smart-table";
import {
  NbComponentShape,
  NbComponentSize,
  NbComponentStatus,
} from "@nebular/theme";
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
        placeholder="Last Name"
      />

      <div class="row">
        <div *ngIf="this.showInstitution" class="col-sm-6">
          <label class="text-label" for="text">Institution:</label>
          <nb-select
            fullWidth
            formControlName="institution"
            [(selected)]="selectedItems"
            placeholder="Institution"
          >
            <nb-option *ngFor="let i of this.institutions" [value]="i.code">
              {{ i.name }}
            </nb-option>
          </nb-select>
        </div>
        <div class="col-sm-6">
          <label class="text-label" for="text">Roles:</label>
          <nb-select
            fullWidth
            formControlName="role"
            [(selected)]="selectedRoles"
            placeholder="Role"
          >
            <nb-option *ngFor="let i of this.roles" [value]="i.id">
              {{ i.name }}
            </nb-option>
          </nb-select>
        </div>
      </div>

      <label class="text-label" for="text">Phone Number:</label>
      <input
        nbInput
        fullWidth
        formControlName="phoneNumber"
        id="text"
        type="text"
        placeholder="Phone Number"
      />
      <label class="text-label" for="text">Email Address:</label>
      <input
        nbInput
        fullWidth
        formControlName="emailAddress"
        id="text"
        type="text"
        placeholder="Email Address"
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
  styleUrls: ["add-user-form.component.scss"],
})
export class AddUserFormComponent implements OnInit {
  statuses: NbComponentStatus[] = [
    "primary",
    "success",
    "info",
    "warning",
    "danger",
  ];
  shapes: NbComponentShape[] = ["rectangle", "semi-round", "round"];
  items: any;
  form: FormGroup;
  selectedOption: any;
  institutions: any = [];
  roles: any = [];
  selectedItems: any;
  selectedRoles: any;
  response: any;

  source: LocalDataSource = new LocalDataSource();
  institutionCode: any;
  showInstitution: boolean = true;

  constructor(
    public windowRef: NbWindowRef,
    private service: NecService,
    private toastrService: NbToastrService
  ) {}

  ngOnInit(): void {

    if(this.service.user.role_id == '2' || this.service.user.role_id == '3' || this.service.user.role_id == '4'){
      this.institutionCode = this.service.user.institutionCode
      this.showInstitution = false
    }
    
    this.service.getInstitutions().subscribe(
      (data) => {
        this.institutions = data;
        console.log(this.institutions);
      },
      (error) => {
        console.log(error);
      }
    );

    // this.service.initializeWebSocketConnection();

    this.service.getRoles().subscribe(
      (data) => {
        this.roles = data;
        if(this.service.user.role_id!=1){
          this.roles = this.roles.filter(el =>
            el.name.includes('Bank')
          )
        }
        console.log(this.roles);
      },
      (error) => {
        console.log(error);
      }
    );


    // Initialize the form model with three form controls
    this.form = new FormGroup({
      firstName: new FormControl("", Validators.required),
      lastName: new FormControl("", [Validators.required]),
      institution: new FormControl("", Validators.required),
      role: new FormControl("", Validators.required),
      emailAddress: new FormControl("", Validators.required),
      phoneNumber: new FormControl("", Validators.required),
    });
  }

  // Define a method to handle the form submission
  onSubmit(): void {
    var object = {
      name: this.form.value.firstName + " " + this.form.value.lastName,
      institutionCode: this.institutionCode ? this.institutionCode : this.form.value.institution,
      role_id: this.form.value.role,
      email: this.form.value.emailAddress,
      phone: this.form.value.phoneNumber,
      createdBy: this.service.user.email,
    };

    // Send a post request to the server endpoint with the FormData object
    this.service.postUsers(object).subscribe(
      (data) => {
        console.log(data);
        // window.parent.postMessage(this.service.getUsers());
        this.response = data;
      },
      (error) => {
        console.error(error);
        this.toastrService.warning(
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
        console.log(this.response);
        if (this.response.errorCode != "0") {
          this.toastrService.warning(
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
          this.windowRef.close();
        }
      }
    );
  }

  close() {
    this.windowRef.close();
  }
}
