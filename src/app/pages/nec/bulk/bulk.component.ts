import { Component, OnInit } from "@angular/core";
import { LocalDataSource, ViewCell } from "ng2-smart-table";
import { NbDialogService } from "@nebular/theme";
import { NbWindowService, NbWindowControlButtonsConfig } from "@nebular/theme";
import { UploadFileComponent } from "./bulk-nec-request/bulk-nec-request.component";
import { NecService } from "../../../@core/mock/nec.service";
import { SubmitForProcessingComponent } from "./submit-for-processing/submit-for-processing.component";
import { DomSanitizer } from "@angular/platform-browser";
import { DataSource } from "ng2-smart-table/lib/lib/data-source/data-source";
import { Deferred } from "ng2-smart-table/lib/lib/helpers";
import { DatePipe } from "@angular/common";
import { SubmitForAuthorizationComponent } from "./submit-for-authorization/submit-for-authorization.component";
import { SingleNECComponent } from "./upload_file_single/single.component";
import { RejectFileUploadComponent } from "./reject-file-upload/reject-file-upload.component";
import { map } from "rxjs/operators";
import { DeclineFileUploadComponent } from "./decline-file-upload/decline-file-upload.component";

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
      this.name = "NEW";
    } else if (value === "2") {
      this.colour = "yellow";
      this.name = "SUBMITTED";
    } else if (value === "3") {
      this.colour = "#fcb103";
      this.name = "PROCESSING";
    } else if (value === "4") {
      this.colour = "#55DD33";
      this.name = "COMPLETED";
    } else if (value === "5") {
      this.colour = "#bd267e";
      this.name = "REJECTED";
    } else if (value === "6") {
      this.colour = "#4665e0";
      this.name = "DECLINE";
    }
    return this.domSanitizer.bypassSecurityTrustHtml(
      `<nb-card-body style="background-color: ${this.colour}; border-radius: 12px; padding-top: 7px; padding-bottom: 7px;">${this.name}</nb-card-body>`
    );
  }

  process = {
    name: "edit",
    title: '<i class="nb-paper-plane" data-toggle="tooltip" data-placement="top" title="Process File"></i>',
  };
  authorize = {
    name: "authorize",
    title: '<i class="nb-checkmark" data-toggle="tooltip" data-placement="top" title="Authorize File"></i>',
  };
  reject = {
    name: "reject",
    title: '<i class="nb-trash" data-toggle="tooltip" data-placement="top" title="Reject File"></i>',
  };
  expand = {
    name: "expand",
    title: '<i class="nb-list" data-toggle="tooltip" data-placement="top" title="Expand File"></i>',
  };
  customActions(roleId: string) {
    var custom = [];
    if (roleId == "3") {
      custom.push(this.process, this.reject, this.expand);
    } else if (roleId == "4") {
      custom.push(this.authorize, this.reject, this.expand);
    }
    return custom;
  }
  settings = {
    mode: "external",
    pager: {
      perPage: 13,
    },
    // hideSubHeader: true,
    actions: {
      position: "right",
      custom: this.customActions(this.service.user.roleId),
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
    public service: NecService,
    private windowService: NbWindowService,
    private dialogService: NbDialogService,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.getUploadedFiles();
    // this.service.initializeWebSocketConnection()
  }

  customFunction(event) {
    if (event.action == "edit") {
      this.submitForProcessing(event);
    } else if (event.action == "authorize") {
      this.submitForAuthorization(event);
    } else if (event.action == "expand") {
      this.openFileRecords(event);
    } else if (event.action == "reject") {
      if (this.service.user.roleId == "3") {
        this.declineFileUpload(event);
      } else if (this.service.user.roleId == "4") {
        this.rejectFileUpload(event);
      }
    }
  }
  compare(a, b) {
    return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();
  }
  getUploadedFiles() {
    this.service.getUploads(this.service.user.email).subscribe(
      (data) => {
        this.files = data;
      },
      (error) => {},
      () => {
        this.files = this.files.sort(this.compare);
        this.source.load(this.files);
      }
    );
  }

  create(event: { newData: Object; source: DataSource; confirm: Deferred }) {
    event.source.append(event.newData);
    event.confirm.reject();
  }

  submitForAuthorization(event): void {
    this.dialogService
      .open(SubmitForAuthorizationComponent, {
        context: {
          title: `Do you want to submit ${event.data.fileName} for authorization?`,
          batchId: event.data.batchId,
          submittedBy: this.service.user.email,
        },
      })
      .onClose.subscribe(() => {
        this.getUploadedFiles();
      });
  }

  submitForProcessing(event): void {
    this.dialogService
      .open(SubmitForProcessingComponent, {
        context: {
          title: `Do you want to submit ${event.data.fileName} for processing?`,
          batchId: event.data.batchId,
          submittedBy: this.service.user.email,
        },
      })
      .onClose.pipe((response) => response)
      .subscribe(() => {
        this.getUploadedFiles();
        this.service.comp$
          .pipe((response) => response)
          .subscribe(() => this.getUploadedFiles());
      });
  }

  rejectFileUpload(event): void {
    this.dialogService
      .open(RejectFileUploadComponent, {
        context: {
          title: `Do you want to reject ${event.data.fileName} ?`,
          batchId: event.data.batchId,
          submittedBy: this.service.user.email,
        },
      })
      .onClose.pipe((response) => response)
      .subscribe(() => {
        this.getUploadedFiles()
      });
  }

  declineFileUpload(event): void {
    this.dialogService
      .open(DeclineFileUploadComponent, {
        context: {
          title: `Do you want to decline ${event.data.fileName} ?`,
          batchId: event.data.batchId,
          submittedBy: this.service.user.email,
        },
      })
      .onClose.pipe((response) => response)
      .subscribe(() => {
        this.getUploadedFiles()
      });
  }

  uploadFile() {
    this.windowService
      .open(UploadFileComponent, {
        title: `Upload File`,
        windowClass: `admin-form-window`,
      })
      .onClose.subscribe(() => {
        this.service.comp$
          .pipe((response) => response)
          .subscribe(() => this.getUploadedFiles());
      });
  }

  openFileRecords(event) {
    // const buttonsConfig: NbWindowControlButtonsConfig = {
    //   minimize: true,
    //   maximize: false,
    //   fullScreen: false,
    //   close: true,
    // };
    this.dialogService.open(SingleNECComponent, {
      context: {
        title: event.data.batchId,
        batchId: event.data.batchId,
      },
      // buttons: buttonsConfig,
    });
  }
}
