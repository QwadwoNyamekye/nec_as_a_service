import { DatePipe } from "@angular/common";
import { Component, Input, OnDestroy } from "@angular/core";
import { NbWindowRef } from "@nebular/theme";
import { Angular5Csv } from "angular5-csv/dist/Angular5-csv";
import jsPDF from "jspdf";
import autotable from "jspdf-autotable";
import { LocalDataSource } from "ng2-smart-table";
import { NecService } from "../../../../../@core/mock/nec.service";

@Component({
  selector: "ngx-single",
  templateUrl: "./upload_file_single.component.html",
  styleUrls: ["./upload_file_single.component.scss"],
})
export class BulkSingleRecordsComponent implements OnDestroy {
  @Input() title: string;
  @Input() batchId: any;

  source: LocalDataSource = new LocalDataSource();
  singleNECList: any = [];
  stompClient: any;
  response: any;
  listener: any;
  receivedData: any;
  loading: boolean = true;
  doc = new jsPDF("landscape");
  settings = {
    pager: {
      perPage: 10,
    },
    hideSubHeader: true,
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
      accountName: {
        title: "Account Name",
        type: "string",
      },
      accountNumber: {
        title: "Account Number",
        type: "string",
      },
      actionCode: {
        title: "Action Code",
        type: "string",
      },
      accountStatus: {
        title: "Account Status",
        type: "string",
      },
      sessionId: {
        title: "Session Id",
        type: "string",
      },
      destBank: {
        title: "Destination Bank",
        type: "string",
      },
      createdBy: {
        title: "Created By",
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

  constructor(private necService: NecService, private windowRef: NbWindowRef) {}

  ngOnInit() {
    this.getSingleNECRecordsRequest();
  }

  close() {
    this.windowRef.close();
  }

  compare(a, b) {
    return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();
  }

  getSingleNECRecordsRequest() {
    this.necService.getFileRecords(this.batchId).subscribe(
      (data: any) => {
        this.singleNECList = data.sort(this.compare);
      },
      (error) => {},
      () => {
        this.singleNECList = this.singleNECList.sort(this.compare);
        this.source.load(this.singleNECList);
        this.loading = false;
      }
    );
  }

  downloadAsPDF() {
    var data = this.singleNECList.map((item) => {
      delete item.batchId;
      item.createdAt = new DatePipe("en-US").transform(
        item.createdAt,
        "YYYY-MM-dd HH:mm:ss"
      );
      return item;
    });
    autotable(this.doc, {
      head: [],
      body: data,
      columns: [
        { header: "Account Name", dataKey: "accountName" },
        { header: "Account Number", dataKey: "accountNumber" },
        { header: "Action Code", dataKey: "actionCode" },
        { header: "Account Status", dataKey: "accountStatus" },
        { header: "Session Id", dataKey: "sessionId" },
        { header: "Destination Bank", dataKey: "destBank" },
        { header: "Source Institution", dataKey: "institutionCode" },
        { header: "Created By", dataKey: "createdBy" },
        { header: "Created At", dataKey: "createdAt" },
      ],
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: "auto" },
        2: { cellWidth: "auto" },
        3: { cellWidth: "auto" },
        5: { cellWidth: "auto" },
        6: { cellWidth: "auto" },
        7: { cellWidth: "auto" },
        8: { cellWidth: "auto" },
      },
    });
    this.doc.save(
      this.necService.user.institutionCode +
        "_SINGLE_NEC_REQUESTS_" +
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
      headers: [
        "Session ID",
        "Src. Institution Code",
        "Src. Institution",
        "Destination Institution",
        "Destination Account Number",
        "Destination Institution Name",
        "Destination Account Name",
        "Action Code",
        "Created By",
        "Narration",
        "Created At",
      ],
    };
    this.singleNECList.map((data) => {
      delete data.id;
      delete data.trackingNum;
      delete data.amount;
      delete data.requestPayload;
      delete data.requestTimestamp;
      delete data.responsePayload;
      delete data.responseTimestamp;
      delete data.srcAccountNumber;
      delete data.batchId;

      return data;
    });
    new Angular5Csv(
      this.singleNECList,
      this.necService.user.institutionCode +
        "_SINGLE_NEC_REQUESTS_" +
        new DatePipe("en-US").transform(Date.now(), "_YYYY-MM-dd_HH:mm:ss"),
      options
    );
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
}
