import { Component, OnInit, OnDestroy } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NbWindowService } from "@nebular/theme";
import { NecService } from "../../../@core/mock/nec.service";
import { DatePipe } from "@angular/common";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import {
  NbToastrService,
  NbComponentShape,
  NbComponentStatus,
  NbDateService,
} from "@nebular/theme"; //NbWindowRef
import jsPDF from "jspdf";
import autotable from "jspdf-autotable";
import { Angular5Csv } from "angular5-csv/dist/Angular5-csv";

@Component({
  selector: "ngx-audit-logs",
  templateUrl: "./audit-logs.component.html",
  styleUrls: ["./audit-logs.component.scss"],
})
export class AuditLogsComponent implements OnInit, OnDestroy {
  source: LocalDataSource = new LocalDataSource();
  users: any;
  stompClient: any;
  response: any;
  listener: any;
  receivedData: any;
  form: FormGroup;
  statuses: NbComponentStatus[] = [
    "primary",
    "success",
    "info",
    "warning",
    "danger",
  ];
  shapes: NbComponentShape[] = ["rectangle", "semi-round", "round"];
  doc = new jsPDF("landscape");
  settings = {
    pager: {
      perPage: 13,
    },
    // hideSubHeader: true,
    actions: {
      position: "right",
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
      deleteButtonContent: '<i class="nb-trash" aria-hidden="true"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: "ID",
        type: "string",
      },
      action: {
        title: "Action",
        type: "string",
      },
      ipAddr: {
        title: "IP Address",
        type: "string",
      },
      request: {
        title: "Request",
        type: "string",
      },
      response: {
        title: "Response",
        type: "string",
      },
      createdBy: {
        title: "Created By",
        type: "string",
      },
      timeStamp: {
        title: "Timestamp",
        type: "string",
      },
    },
  };
  bankList: Object;
  max: Date;
  min: Date;
  institutions: Object;
  showInstitution: Boolean = true;
  institutionCode;
  constructor(
    private necService: NecService,
    private toastrService: NbToastrService,
    protected dateService: NbDateService<Date>
  ) {}

  ngOnInit() {
    this.listener = (event: MessageEvent) => {
      this.receivedData = event.data;
      this.source.load(this.receivedData);
    };

    if (
      this.necService.user.roleId == "2" ||
      this.necService.user.roleId == "3" ||
      this.necService.user.roleId == "4"
    ) {
      this.institutionCode = this.necService.user.institutionCode;
      this.showInstitution = false;
    }

    this.max = this.dateService.addDay(this.dateService.today(), 0);

    window.addEventListener("message", this.listener);

    this.form = new FormGroup({
      type: new FormControl("", Validators.required),
      destBank: new FormControl("", Validators.required),
      endDate: new FormControl("", Validators.required),
      startDate: new FormControl("", Validators.required),
      code: new FormControl("", Validators.required),
    });
    this.getAuditLogs();
  }

  downloadAsPDF() {
    autotable(this.doc, {
      head: [],
      body: this.response,
      columns: [
        { header: "ID", dataKey: "id" },
        { header: "Action", dataKey: "action" },
        { header: "IP Address", dataKey: "ipAddr" },
        { header: "Request", dataKey: "request" },
        { header: "Response", dataKey: "response" },
        { header: "Created By", dataKey: "createdBy" },
        { header: "Timestamp", dataKey: "timeStamp" },
      ],
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: "auto" },
        2: { cellWidth: "auto" },
        3: { cellWidth: "auto" },
        4: { cellWidth: "auto" },
        5: { cellWidth: "auto" },
        6: { cellWidth: "auto" },
      },
    });
    this.doc.save(
      this.necService.user.institutionCode +
        "_AUDIT_LOGS_REPORT" +
        new DatePipe("en-US").transform(Date.now(), "_YYYY-MM-dd_HH:mm:ss") +
        ".pdf"
    );
  }

  downloadAsCSV() {
    const options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalseparator: ".",
      showLabels: true,
      // showTitle: true,
      // useBom: true,
      headers: [
        "ID",
        "Action",
        "IP Address",
        "Request",
        "Response",
        "Created By",
        "Timestamp",
      ],
    };
    new Angular5Csv(
      this.response,
      this.necService.user.institutionCode +
        "_AUDIT_LOGS_REPORT" +
        new DatePipe("en-US").transform(Date.now(), "_YYYY-MM-dd_HH:mm:ss"),
      options
    );
  }

  setMin(event) {
    this.min = event;
  }

  compare(a, b) {
    return new Date(b.timeStamp).valueOf() - new Date(a.timeStamp).valueOf();
  }

  ngOnDestroy() {
    window.removeEventListener("message", this.listener);
  }

  onEditRowSelect(event): void {
    if (window.open()) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onDeleteConfirm(event): void {
    if (window.confirm("Are you sure you want to delete?")) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  /////////////////FORM STUFF

  getAuditLogs() {
    this.necService.getAuditLogs().subscribe(
      (response) => {
        this.response = response;
        this.source.load(this.response.sort(this.compare));
        return response;
      },
      (error) => {
        this.toastrService.warning(
          "Audit Log Request Failed: " + error.error.errorMessage,
          "Audit Log Request",
          {
            status: "danger",
            destroyByClick: true,
            duration: 8000,
          }
        );
      },
      () => {}
    );
  }

  close() {
    //this.windowRef.close();
  }
}
