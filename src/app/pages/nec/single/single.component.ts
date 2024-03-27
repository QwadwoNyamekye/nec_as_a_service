import { Component, OnInit, OnDestroy } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NbWindowService } from "@nebular/theme";
import { NecService } from "../../../@core/mock/nec.service";
import { SingleNECRequestComponent } from "./single-nec-request/single-nec-request.component";
import { DatePipe } from "@angular/common";
import {
  NbToastrService,
  NbComponentShape,
  NbComponentStatus,
  NbDateService,
} from "@nebular/theme"; //NbWindowRef
import { map } from "rxjs/operators";
import { Angular5Csv } from "angular5-csv/dist/Angular5-csv";
import jsPDF from "jspdf";
import autotable from "jspdf-autotable";

@Component({
  selector: "ngx-single",
  templateUrl: "./single.component.html",
  styleUrls: ["./single.component.scss"],
})
export class SingleNECComponent implements OnInit, OnDestroy {
  source: LocalDataSource = new LocalDataSource();
  singleNECList: any;
  stompClient: any;
  response: any;
  listener: any;
  receivedData: any;
  doc = new jsPDF("landscape");

  statuses: NbComponentStatus[] = [
    "primary",
    "success",
    "info",
    "warning",
    "danger",
  ];
  shapes: NbComponentShape[] = ["rectangle", "semi-round", "round"];
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
      sessionId: {
        title: "Session ID",
        type: "string",
      },
      destInstitution: {
        title: "Dest. Institution Code",
        type: "string",
      },
      destInstitutionName: {
        title: "Dest. Institution",
        type: "string",
      },
      destAccountNumber: {
        title: "Destination Account",
        type: "string",
      },
      destAccountName: {
        title: "Account Name",
        type: "string",
      },
      // srcInstitution: {
      //   title: "Src. Institution Code",
      //   type: "string",
      // },
      // srcInstitutionName: {
      //   title: "Src. Institution",
      //   type: "string",
      // },
      actionCode: {
        title: "Action Code",
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
    protected service: NecService,
    private windowService: NbWindowService
  ) {
    this.getSingleNECRecordsRequest();
  }
  compare(a, b) {
    return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();
  }
  getSingleNECRecordsRequest() {
    this.service.getSingleNECList(this.service.user.email).subscribe(
      (response: any) => {
        this.singleNECList = response.data;
      },
      (error) => {
      },
      () => {
        this.singleNECList = this.singleNECList.sort(this.compare)
        this.source.load(this.singleNECList);
      }
    );
  }

  ngOnInit() {
    this.getSingleNECRecordsRequest();
    // this.listener = (event: MessageEvent) => {
    //   this.receivedData = event.data;
    //   this.source.load(this.receivedData);
    // };
    // window.addEventListener("message", this.listener);
    // this.service.initializeWebSocketConnection()
  }

  ngOnDestroy() {
    window.removeEventListener("message", this.listener);
  }

  makeNECRequest() {
    this.response = this.windowService
      .open(SingleNECRequestComponent, {
        title: `Make NEC Request`,
        windowClass: `admin-form-window`,
      })
      .onClose.pipe(map((response) => response))
      .subscribe(
        (event) => {
        },
        (error) => {},
        () => {
          this.getSingleNECRecordsRequest();
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
