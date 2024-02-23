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

@Component({
  template: `
    <form class="form" [formGroup]="form">
      <label for="subject">Choose File</label>
      <input
        nbInput
        fullWidth
        formControlName="file"
        id="subject"
        type="file"
        (change)="onFileSelected($event.target.files)"
        accept=".csv"
        multiple="multiple"
      />
      <label class="text-label" for="text">Description</label>
      <input
        nbInput
        fullWidth
        formControlName="description"
        id="text"
        type="text"
      />
      <label class="text-label" for="text">Record Count:</label>
      <input
        nbInput
        fullWidth
        formControlName="count"
        id="text"
        type="number"
      />
      <br />
      <button
        nbButton
        type="submit"
        (click)="onSaveFile()"
        [disabled]="!form.valid"
        [status]="statuses[0]"
        [shape]="shapes[1]"
      >
        Submit
      </button>
    </form>
  `,
  styleUrls: ["bulk-nec-request.component.scss"],
})
export class BulkNEComponent implements OnInit {
  items: any;
  form: FormGroup;
  selectedOption: any;
  institutions: any = [];
  roles: any = [];
  filesToUpload: File[] | null = [];
  statuses: NbComponentStatus[] = [
    "primary",
    "success",
    "info",
    "warning",
    "danger",
  ];
  shapes: NbComponentShape[] = ["rectangle", "semi-round", "round"];
  source: LocalDataSource = new LocalDataSource();
  response: any;
  constructor(public windowRef: NbWindowRef, private service: NecService) {}

  ngOnInit(): void {
    // Initialize the form model with three form controls
    this.form = new FormGroup({
      file: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required),
      count: new FormControl("", Validators.required),
    });
    // this.service.initializeWebSocketConnection();
  }

  onFileSelected(event: FileList) {
    for (let index = 0; index < event.length; index++) {
      this.filesToUpload.push(event.item(index));
    }
  }
  onSaveFile() {
    const formData: FormData = new FormData();
    console.log(this.filesToUpload);
    this.filesToUpload.forEach((file) => {
      formData.append("files", file);
    });
    this.response = this.service
      .uploadFile(
        formData,
        this.form.value.description,
        this.service.user.email,
        this.form.value.count
      )
      .subscribe(
        (response) => {
          console.log("AAAAAAAAAAAAAAAAAAAAA");
          console.log(response);
          this.close();
        },
        (error) => console.error(error)
      );
  }
  close() {
    this.filesToUpload = [];
    // window.location.reload()
    this.windowRef.close();
  }
  //   reloadCurrentRoute() {
  //     let currentUrl = this.router.url;
  //     this.router.navigateByUrl('/dashboard', {skipLocationChange: true}).then(() => {
  //         this.router.navigate([currentUrl]);
  //     });
  // }
}
