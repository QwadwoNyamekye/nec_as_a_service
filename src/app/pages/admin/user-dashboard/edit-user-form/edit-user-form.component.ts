import { Component, OnInit, Input } from "@angular/core";
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
        <div class="col-sm-6">
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
  styleUrls: ["edit-user-form.component.scss"],
})
export class EditUserFormComponent implements OnInit {
  @Input() email: string;
  @Input() currentValues: any;
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
  source: LocalDataSource = new LocalDataSource();
  response: any;

  constructor(
    public windowRef: NbWindowRef,
    private service: NecService,
    private toastrService: NbToastrService
  ) {}

  ngOnInit(): void {
    this.service.getInstitutions().subscribe(
      (data) => {
        this.institutions = data;
        console.log(this.institutions);
      },
      (error) => {
        console.log(error);
      }
    );
    this.service.getRoles().subscribe(
      (data) => {
        this.roles = data;
        console.log(this.roles);
      },
      (error) => {
        console.log(error);
      }
    );
    this.form = new FormGroup({
      firstName: new FormControl(this.currentValues.firstName, Validators.required),
      lastName: new FormControl(this.currentValues.lastName, [Validators.required]),
      institution: new FormControl(this.currentValues.institution, Validators.required),
      role: new FormControl(this.currentValues.role, Validators.required),
      // emailAddress: new FormControl("", Validators.required),
    });
    // this.service.initializeWebSocketConnection();
  }

  // Define a method to handle the form submission
  onSubmit(): void {
    var object = {
      name: this.form.value.firstName + " " + this.form.value.lastName,
      institutionCode: this.form.value.institution,
      role_id: this.form.value.role,
      email: this.email,
    };
    // Send a post request to the server endpoint with the FormData object
    this.service.editUser(object).subscribe(
      (response) => {
        console.log(response);
        this.response = response;
        // window.parent.postMessage(this.service.getUsers());
      },
      (error) => console.error(error),
      () => {
        console.log(this.response);
        if (this.response.errorCode != "0") {
          this.toastrService.warning(
            "User Edit Failed: " + this.response.errorMessage,
            "User Edit",
            {
              status: "danger",
              destroyByClick: true,
              duration: 100000,
            }
          );
        } else {
          this.toastrService.success("User Edit Success", "User Edit", {
            status: "success",
            destroyByClick: true,
            duration: 100000,
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
