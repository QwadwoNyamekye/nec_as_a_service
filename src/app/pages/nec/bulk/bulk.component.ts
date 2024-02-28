import { Component, OnInit } from "@angular/core";
import { LocalDataSource, ViewCell } from "ng2-smart-table";
import { NbDialogService } from "@nebular/theme";
import { NbWindowService } from "@nebular/theme";
import { BulkNEComponent } from "./bulk-nec-request/bulk-nec-request.component";
import { NecService } from "../../../@core/mock/nec.service";
import { SubmitForProcessingComponent } from "./submit-for-processing/submit-for-processing.component";
import { DomSanitizer } from "@angular/platform-browser";
import { DataSource } from "ng2-smart-table/lib/lib/data-source/data-source";
import { Deferred } from "ng2-smart-table/lib/lib/helpers";
import { DatePipe } from "@angular/common";
import { SubmitProcessingComponent } from "./submit_processing/submit-for-processing.component";
import { SingleNECComponent } from "./upload_file_single/single.component";

@Component({
  selector: "ngx-bulk",
  templateUrl: "./bulk.component.html",
  styleUrls: ["./bulk.component.scss"],
})
export class BulkUploadComponent implements OnInit {
  colour: string;
  name: string;
  source: LocalDataSource = new LocalDataSource();
  files: any;
  selectedRow: any;
  renderValue: string;
  listener: any;
  receivedData: any;

  getHtmlForCell(value: string) {
    if (value === "0") {
      this.colour = "lightcoral";
      this.name = "UPLOADING";
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
      custom: [
        {
          name: "edit",
          title: '<i class="nb-edit"></i>',
        },
        {
          name: "authorize",
          title: '<i class="nb-checkmark"></i>',
        },
        {
          name: "expand",
          title: '<i class="nb-plus"></i>',
        },
      ],
      add: false, //  if you want to remove add button
      edit: false, //  if you want to remove edit button
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
      deleteButtonContent: '<i class="nb-checkmark" aria-hidden="true"></i>',
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
        title: "Created At",
        type: "string",
        valuePrepareFunction: (date) => {
          return new DatePipe("en-US").transform(date, "YYYY-MM-dd HH:mm:ss");
        },
      },
    },
  };

  constructor(
    private service: NecService,
    private windowService: NbWindowService,
    private dialogService: NbDialogService,
    private domSanitizer: DomSanitizer
  ) {
    this.getUploads();
  }
  ngOnInit(): void {
    // this.service.initializeWebSocketConnection()
  }

  customFunction(event) {
    console.log(event);
    if (event.action == "edit") {
      this.onEditRowSelect(event);
    } else if (event.action == "authorize") {
      this.submitForAuthorization(event);
    } else if (event.action == "expand") {
      this.openFileRecords(event);
    }
  }
  compare( a, b ) {
    return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
  }
  getUploads() {
    this.service.getUploads().subscribe(
      (data) => {
        this.files = data;
      },
      (error) => {
        console.log(error);
      },
      () => {
        console.log(this.files.sort(this.compare));
        this.source.load(this.files.sort(this.compare));
      }
    );
  }

  create(event: { newData: Object; source: DataSource; confirm: Deferred }) {
    event.source.append(event.newData);
    event.confirm.reject();
  }

  submitForAuthorization(event): void {
    console.log(event);
    this.dialogService
      .open(SubmitProcessingComponent, {
        context: {
          title: `Do you want to submit ${event.data.fileName} for authorization?`,
          batchId: event.data.batchId,
          submittedBy: this.service.user.email,
        },
      })
      .onClose.subscribe(() => {
        this.getUploads();
      });
  }

  onEditRowSelect(event): void {
    console.log(event);
    this.dialogService
      .open(SubmitForProcessingComponent, {
        context: {
          title: `Do you want to submit ${event.data.fileName} for processing?`,
          batchId: event.data.batchId,
          submittedBy: this.service.user.email,
        },
      })
      .onClose.subscribe(() => {
        this.getUploads();
      });
  }
  openWindowForm() {
    this.windowService
      .open(BulkNEComponent, {
        title: `Upload File`,
        windowClass: `admin-form-window`,
      })
      .onClose.subscribe(() => {
        this.getUploads();
      });
  }

  openFileRecords(event) {
    this.windowService.open(SingleNECComponent, {
      context: {
        title: `File Test`,
        batchId: event.data.batchId,
      },
    });
  }
}
