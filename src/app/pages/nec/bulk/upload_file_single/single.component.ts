import { Component, OnDestroy, Input } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NbWindowService } from "@nebular/theme";
import { NecService } from "../../../../@core/mock/nec.service";
import { DatePipe } from "@angular/common";
import { Angular5Csv } from "angular5-csv/dist/Angular5-csv";
import jsPDF from "jspdf";
import autotable from "jspdf-autotable";

@Component({
  selector: "ngx-single",
  templateUrl: "./single.component.html",
  styleUrls: ["./single.component.scss"],
})
export class SingleNECComponent implements OnDestroy {
  @Input() title: string;
  @Input() batchId: any;

  source: LocalDataSource = new LocalDataSource();
  singleNECList: any;
  stompClient: any;
  response: any;
  listener: any;
  receivedData: any;
  doc = new jsPDF("landscape");

  settings = {
    pager: {
      perPage: 13,
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

  constructor(
    private service: NecService,
    private windowService: NbWindowService
  ) {
    this.getSingleNECRecordsRequest();
  }

  ngOnInit() {
    this.getSingleNECRecordsRequest();
  }

  compare(a, b) {
    return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();
  }

  getSingleNECRecordsRequest() {
    this.service.getFileRecords(this.batchId).subscribe(
      (data: any) => {
        this.singleNECList = data.sort(this.compare);
        console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS");
        console.log(this.singleNECList);
      },
      (error) => {
        console.log(error);
      },
      () => {
        console.log(this.singleNECList.sort(this.compare));
        this.source.load(this.singleNECList.sort(this.compare));
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
    console.log("::::::::::::::::::::::");
    console.log(data);
    autotable(this.doc, {
      head: [],
      body: data,
      columns: [
        { header: "Session Id", dataKey: "sessionId" },
        { header: "Destination Institution Code", dataKey: "destInstitution" },
        { header: "Destination Institution", dataKey: "destInstitutionName" },
        { header: "Destination Account", dataKey: "destAccountName" },
        { header: "Destination Account Name", dataKey: "destAccountName" },
        { header: "Source Institution", dataKey: "srcInstitution" },
        { header: "Source Institution Name", dataKey: "srcInstitutionName" },
        { header: "Narration", dataKey: "narration" },
        // { header: "Request Payload", dataKey: "requestPayload" },
        // { header: "Request Timestamp", dataKey: "requestTimestamp" },
        // { header: "Response Payload", dataKey: "responsePayload" },
        // { header: "Response Timestamp", dataKey: "responseTimestamp" },
        { header: "Action Code", dataKey: "actionCode" },
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
        9: { cellWidth: "auto" },
        // 10: { cellWidth: "auto" },
        // 11: { cellWidth: "auto" },
        // 12: { cellWidth: "auto" },
        // 13: { cellWidth: "auto" },
      },
    });
    this.doc.save(
      this.service.user.institutionCode +
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
    console.log("::::::::::::::::::::::");
    console.log(this.singleNECList);
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
      this.service.user.institutionCode +
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
