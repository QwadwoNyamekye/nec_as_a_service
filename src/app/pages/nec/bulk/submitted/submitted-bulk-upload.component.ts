import { Component, OnInit } from "@angular/core";
import { LocalDataSource, ViewCell } from "ng2-smart-table";
import { NbDialogService } from "@nebular/theme";
import { NbWindowService, NbWindowControlButtonsConfig } from "@nebular/theme";
import { NecService } from "../../../../@core/mock/nec.service";
import { SubmitForProcessingComponent } from "../modals/submit-for-processing/submit-for-processing.component";
import { DomSanitizer } from "@angular/platform-browser";
import { DataSource } from "ng2-smart-table/lib/lib/data-source/data-source";
import { Deferred } from "ng2-smart-table/lib/lib/helpers";
import { DatePipe } from "@angular/common";
import { SubmitForAuthorizationComponent } from "../modals/submit-for-authorization/submit-for-authorization.component";
import { SingleNECComponent } from "../modals/upload_file_single/single.component";
import { RejectFileUploadComponent } from "../modals/reject-file-upload/reject-file-upload.component";
import { DeclineFileUploadComponent } from "../modals/decline-file-upload/decline-file-upload.component";

@Component({
  selector: "ngx-bulk",
  templateUrl: "./submitted-bulk-upload.component.html",
  styleUrls: ["./submitted-bulk-upload.component.scss"],
})
export class BulkSubmittedUploadComponent implements OnInit {
  colour: string;
  name: string;
  source: LocalDataSource = new LocalDataSource();
  files: any;
  selectedRow: any;
  renderValue: string;
  listener: any;
  receivedData: any;

  getHtmlForCell(value: string) {
    this.colour = "yellow";
    this.name = "SUBMITTED";
    return this.domSanitizer.bypassSecurityTrustHtml(
      `<nb-card-body style="background-color: ${this.colour}; border-radius: 12px; padding-top: 7px; padding-bottom: 7px;">${this.name}</nb-card-body>`
    );
  }

  process = {
    name: "edit",
    title:
      '<i class="nb-paper-plane" data-toggle="tooltip" data-placement="top" title="Process File"></i>',
  };
  authorize = {
    name: "authorize",
    title:
      '<i class="nb-checkmark" data-toggle="tooltip" data-placement="top" title="Authorize File"></i>',
  };
  reject = {
    name: "reject",
    title:
      '<i class="nb-trash" data-toggle="tooltip" data-placement="top" title="Reject File"></i>',
  };
  expand = {
    name: "expand",
    title:
      '<i class="nb-list" data-toggle="tooltip" data-placement="top" title="Expand File"></i>',
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
  ) {}

  ngOnInit(): void {
    this.getSubmittedUploadedFiles();
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
  getSubmittedUploadedFiles() {
    this.service.getUploadsByStatus("SUBMITTED").subscribe(
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
        this.getSubmittedUploadedFiles();
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
        this.getSubmittedUploadedFiles();
        this.service.comp$
          .pipe((response) => response)
          .subscribe(() => this.getSubmittedUploadedFiles());
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
        this.getSubmittedUploadedFiles();
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
        this.getSubmittedUploadedFiles();
      });
  }

  openFileRecords(event) {
    const buttonsConfig: NbWindowControlButtonsConfig = {
      minimize: true,
      maximize: false,
      fullScreen: false,
      close: true,
    };
    this.windowService.open(SingleNECComponent, {
      context: {
        title: event.data.batchId,
        batchId: event.data.batchId,
      },
      buttons: buttonsConfig,
    });
  }
}
