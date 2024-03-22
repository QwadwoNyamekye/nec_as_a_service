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
  selector: "ngx-nec-report",
  templateUrl: "./nec-report.component.html",
  styleUrls: ["./nec-report.component.scss"],
})
export class NecReportComponent implements OnInit, OnDestroy {
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
      sessionId: {
        title: "Session ID",
        type: "string",
      },
      narration: {
        title: "Narration",
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
      srcInstitution: {
        title: "Src. Institution Code",
        type: "string",
      },
      srcInstitutionName: {
        title: "Src. Institution",
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
  bankList: Object;
  max: Date;
  min: Date;
  institutions: Object;
  showInstitution: Boolean = true;
  institutionCode;
  loading: boolean = false;
  constructor(
    public service: NecService,
    private toastrService: NbToastrService,
    protected dateService: NbDateService<Date>
  ) {
    //this.getUsers();
  }

  ngOnInit() {
    this.listener = (event: MessageEvent) => {
      this.receivedData = event.data;
      this.source.load(this.receivedData);
    };

    if (
      this.service.user.roleId == "2" ||
      this.service.user.roleId == "3" ||
      this.service.user.roleId == "4"
    ) {
      this.institutionCode = this.service.user.institutionCode;
      this.showInstitution = false;
    }

    this.max = this.dateService.addDay(this.dateService.today(), 0);

    window.addEventListener("message", this.listener);
    // this.service.initializeWebSocketConnection()

    this.form = new FormGroup({
      type: new FormControl(""),
      destBank: new FormControl(""),
      endDate: new FormControl("", Validators.required),
      startDate: new FormControl("", Validators.required),
      code: new FormControl(""),
    });

    /////GET BANKS///////////////
    this.service.getBanks().subscribe(
      (data) => {
        this.bankList = data;
      },
      (error) => {
      },
      () => {
      }
    );

    this.service.getInstitutions().subscribe(
      (data) => {
        this.institutions = data;
      },
      (error) => {
      },
      () => { }
    );
  }

  downloadAsPDF() {
    autotable(this.doc, {
      head: [],
      body: this.response,
      columns: [
        { header: "Session Id", dataKey: "sessionId" },
        { header: "Narration", dataKey: "narration" },
        { header: "Dest. Institution Code", dataKey: "destInstitution" },
        { header: "Dest. Institution", dataKey: "destInstitutionName" },
        { header: "Dest. Account", dataKey: "destAccountNumber" },
        { header: "Account Name", dataKey: "destAccountName" },
        { header: "Src. Institution Code", dataKey: "srcInstitution" },
        { header: "Action Code", dataKey: "actionCode" },
        { header: "Account Status", dataKey: "accountStatus" },
        { header: "Created By", dataKey: "createdBy" },
        { header: "Created At", dataKey: "createdAt" },
      ],
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: "auto" },
        2: { cellWidth: "auto" },
        3: { cellWidth: "auto" },
        4: { cellWidth: "auto" },
        5: { cellWidth: "auto" },
        6: { cellWidth: "auto" },
        7: { cellWidth: "auto" },
        8: { cellWidth: "auto" },
        9: { cellWidth: "auto" },
        10: { cellWidth: "auto" },
      },
    });
    this.doc.save(
      this.service.user.institutionCode + "_SINGLE_NEC_REPORT" +
      new DatePipe("en-US").transform(Date.now(), "_YYYY-MM-dd_HH:mm:ss") + ".pdf"
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
        "Account Status",
        "Destination Institution",
        "Destination Account Code",
        "Source Institution Code",
        "Account Name",
        "Destination Account",
        "Session ID",
        "Action Code",
        "Batch ID",
        "Narration",
        "Created By",
        "Created At",
      ],
    };
    new Angular5Csv(
      this.response,
      this.service.user.institutionCode + "_SINGLE_NEC_REPORT" +
      new DatePipe("en-US").transform(Date.now(), "_YYYY-MM-dd_HH:mm:ss"),
      options
    );
  }

  setMin(event) {
    this.min = event;
  }

  setMax(event) {
    this.max = event;
  }

  compare(a, b) {
    return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();
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

  onSubmit(): void {
    this.loading = true;
    this.form.value.endDate.setHours("23");
    this.form.value.endDate.setMinutes("59");
    this.form.value.endDate.setSeconds("59");
    this.form.value.endDate.setMilliseconds("999");
    this.form.value.code = this.institutionCode
      ? this.institutionCode
      : this.form.value.code;

    this.service.getNecReport(this.form.value).subscribe(
      (response) => {
        this.response = response;
        this.source.load(this.response);
        this.loading = false
        return response;
      },
      (error) => {
        this.loading = false;
        console.error(error);
        this.toastrService.warning(
          "NEC Report Request Failed: " + error.error.errorMessage,
          "NEC Report Request",
          {
            status: "danger",
            destroyByClick: true,
            duration: 8000,
          }
        );
      },
      () => { }
    );
    //this.close();
  }
  close() {
    //this.windowRef.close();
  }
}
