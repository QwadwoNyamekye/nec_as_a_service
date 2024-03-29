import { Component, OnInit } from "@angular/core";
import { LocalDataSource, ViewCell } from "ng2-smart-table";
import { NbDialogService } from "@nebular/theme";
import { NbWindowService } from "@nebular/theme";
import { BulkNEComponent } from "./bulk-nec-request/bulk-nec-request.component";
import { BulkUploadService } from "./bulk.service";
import { SubmitForProcessingComponent } from "./submit-for-processing/submit-for-processing.component";
import { DomSanitizer } from "@angular/platform-browser";
import { DataSource } from 'ng2-smart-table/lib/lib/data-source/data-source';
import { Deferred } from 'ng2-smart-table/lib/lib/helpers';
import { DatePipe } from '@angular/common';

@Component({
  selector: "ngx-bulk",
  templateUrl: "./bulk.component.html",
  styleUrls: ["./bulk.component.scss"],
})
export class BulkUploadComponent {
  colour: string;
  name: string;
  getHtmlForCell(value: string) {
    if (value === "0") {
      this.colour = "lightcoral";
      this.name = "NEW";
    } else if (value === "1") {
      this.colour = "lightskyblue";
      this.name = "SUBMITTED";
    } else if (value === "2") {
      this.colour = "yellow";
      this.name = "PROCESSING";
    } else {
      this.colour = "green";
      this.name = "COMPLETED";
    }
    return this.domSanitizer.bypassSecurityTrustHtml(
      `<nb-card-body style="background-color: ${this.colour}; border-radius: 12px; padding-top: 7px; padding-bottom: 7px;">${this.name}</nb-card-body>`
    );
  }
  settings = {
    mode: "external",
    pager: {
      perPage: 15,
    },
    hideSubHeader: true,
    actions: {
      position: "right",
      add: false, //  if you want to remove add button
      // edit: false,     //  if you want to remove edit button
      delete: false, //  if you want to remove delete button
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash" aria-hidden="true"></i>',
      confirmDelete: true,
    },
    columns: {
      batchId: {
        title: "Batch ID",
        type: "string",
      },
      totalCount: {
        title: "Record Count",
        type: "string",
      },
      description: {
        title: "Description",
        type: "string",
      },
      fileName: {
        title: "File Name",
        type: "string",
      },
      status: {
        title: "Status",
        type: "html",
        valuePrepareFunction: (status) => {
          return this.getHtmlForCell(status);
        },
      },
      institutionCode: {
        title: "Institution Code",
        type: "string",
      },
      createdAt: {
        title: 'Created At',
        type: 'string',
        valuePrepareFunction: (date) => {
          return new DatePipe('en-US').transform(date, 'YYYY-MM-dd HH:m:ss');
        },
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();
  files: any;
  selectedRow: any;
  renderValue: string;

  constructor(
    private service: BulkUploadService,
    private windowService: NbWindowService,
    private dialogService: NbDialogService,
    private domSanitizer: DomSanitizer
  ) {
    this.getUploads()
  }

  getUploads(){
    this.service.getUploads().subscribe(
      (data) => {
        this.files = data;
      },
      (error) => {
        console.log(error);
      },
      () => {
        console.log(this.files);
        this.source.load(this.files);
      }
    );
  }

  create(event: { newData: Object; source: DataSource; confirm: Deferred }) {
    event.source.append(event.newData);
    event.confirm.reject();
  }

  onEditRowSelect(event): void {
    console.log(event);
    this.dialogService.open(SubmitForProcessingComponent, {
      context: {
        title: `Do you want to submit ${event.data.fileName} for processing?`,
        batchId: event.data.batchId,
        submittedBy: "asalia@gmail.com",
      },
    });
  }
  openWindowForm() {
    this.windowService.open(BulkNEComponent, {
      title: `Upload File`,
      windowClass: `admin-form-window`,
    });
  }
}
