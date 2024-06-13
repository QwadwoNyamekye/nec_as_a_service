import { Component, OnInit } from "@angular/core";
import { NbWindowRef } from "@nebular/theme";
import { NecService } from "../../../../../@core/mock/nec.service";
import { FormGroup, FormControl } from "@angular/forms";
import { Validators } from "@angular/forms";
import { LocalDataSource } from "ng2-smart-table";
import { NbComponentShape, NbComponentStatus } from "@nebular/theme";
import { NbToastrService } from "@nebular/theme";

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
        [status]="statuses[0]"
        [shape]="shapes[2]"
        [nbSpinner]="loading"
        nbSpinnerStatus="danger"
        [disabled]="loading || !fileType || !form.valid"
      >
        Submit
      </button>
    </form>
  `,
  styleUrls: ["bulk-nec-request.component.scss"],
})
export class UploadFileComponent implements OnInit {
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
  loading: boolean = false;
  fileType: boolean = false;

  constructor(
    public windowRef: NbWindowRef,
    private necService: NecService,
    private toastrService: NbToastrService
  ) {}

  ngOnInit(): void {
    // Initialize the form model with three form controls
    this.form = new FormGroup({
      file: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required),
      count: new FormControl("", Validators.required),
    });
  }

  onFileSelected(event: FileList) {
    for (let index = 0; index < event.length; index++) {
      if (event.item(index).type == "text/csv") {
        this.fileType = true;
        this.filesToUpload.push(event.item(index));
      } else {
        this.toastrService.warning(
          "Invalid File Type: ." +
            event.item(index).name.split(".").pop() +
            " Only *.CSV* files accepted.",
          "File Type",
          {
            status: "danger",
            destroyByClick: true,
            duration: 8000,
          }
        );
      }
    }
  }

  onSaveFile() {
    this.loading = true;
    const formData: FormData = new FormData();
    this.filesToUpload.forEach((file) => {
      formData.append("files", file);
    });
    this.response = this.necService
      .uploadFile(
        formData,
        this.form.value.description,
        this.necService.user.email,
        this.form.value.count
      )
      .subscribe(
        (response) => {
          this.response = response;
        },
        (error) => {
          this.loading = false;
          this.toastrService.warning(
            "File Upload Failed: " + error.error.errorMessage,
            "Bulk File Upload",
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
              "File Upload Failed: " + this.response.errorMessage,
              "Bulk File Upload",
              {
                status: "danger",
                destroyByClick: true,
                duration: 8000,
              }
            );
          } else {
            this.toastrService.success("File Upload Success", "File Upload", {
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
    this.filesToUpload = [];
    this.windowRef.close();
  }
}
