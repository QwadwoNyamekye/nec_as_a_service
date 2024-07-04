import { DatePipe } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NbDateService, NbToastrService } from "@nebular/theme";
import { Angular5Csv } from "angular5-csv/dist/Angular5-csv";
import jsPDF from "jspdf";
import autotable from "jspdf-autotable";
import { LocalDataSource } from "ng2-smart-table";
import { NecService } from "../../../@core/mock/nec.service";

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
  bankList: any;
  max: Date;
  min: Date;
  institutions: any;
  showInstitution = false;
  showBank = false;
  institutionCode = this.necService.user.institutionCode;
  loading = false;
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

    this.max = this.dateService.addDay(this.dateService.today(), 0);

    window.addEventListener("message", this.listener);

    this.form = new FormGroup({
      startDate: new FormControl("", Validators.required),
      endDate: new FormControl("", Validators.required),
      destBank: new FormControl(""),
      bankCode: new FormControl(""),
      code: new FormControl(""),
    });

    if (["1", "5", "6"].includes(this.necService.user.roleId)) {
      // this.showInstitution = true;
      this.showBank = true;
    } else if (["2", "8"].includes(this.necService.user.roleId)) {
      this.showInstitution = true;
      this.showBank = false;
      this.getInstitutions(this.necService.user.institutionCode);
      this.form
        .get("bankCode")
        .patchValue(this.necService.user.institutionCode);
    } else if (["3", "4", "9"].includes(this.necService.user.roleId)) {
      // this.showInstitution = false;
      this.showBank = false;
      this.form.get("code").patchValue(this.necService.user.institutionCode);
      this.form.get("bankCode").patchValue(this.necService.user.bankCode);
    }

    /////GET BANKS///////////////
    this.necService
      .getInstitutionsByBank(this.necService.user.institutionCode)
      .subscribe(
        (data) => {
          this.bankList = data;
          // if (this.necService.user.roleId == "1") {
          this.bankList = this.bankList.filter(
            (bank) => !bank.code.includes("INS-NEC-0000")
          );
          // }
        },
        (_error) => {},
        () => {
          this.bankList = this.bankList.sort(this.compare);
        }
      );
  }

  getInstitutions(bank) {
    this.necService.getInstitutionsByBank(bank).subscribe(
      (data) => {
        this.institutions = data;
        if (this.institutions.length) {
          this.showInstitution = true;
          // if (this.necService.user.roleId == "1") {
          this.institutions = this.institutions.filter(
            (bank) => !bank.code.includes("INS-NEC-0000")
          );
          // }
        } else {
          this.showInstitution = false;
        }
      },
      (_error) => {},
      () => {
        this.institutions = this.institutions.sort(this.compare);
      }
    );
  }

  selectBank(event) {
    this.form.get("code").patchValue("");
    this.getInstitutions(event);
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
      this.necService.user.institutionCode +
        "_SINGLE_NEC_REPORT" +
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
      this.necService.user.institutionCode +
        "_SINGLE_NEC_REPORT" +
        new DatePipe("en-US").transform(Date.now(), "_YYYY-MM-dd_HH:mm:ss"),
      options
    );
  }

  setMin(event) {
    this.min = event;
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

  onSubmit(): void {
    this.loading = true;
    // this.form.get("destBank").patchValue(this.form.value.bankCode);
    this.form.value.endDate.setHours("23");
    this.form.value.endDate.setMinutes("59");
    this.form.value.endDate.setSeconds("59");
    this.form.value.endDate.setMilliseconds("999");

    this.necService.getNecReport(this.form.value).subscribe(
      (response) => {
        this.loading = false;
        this.response = response;
        this.source.load(this.response);
      },
      (error) => {
        this.loading = false;
        this.toastrService.danger(
          "NEC Report Request Failed: " + error.error.errorMessage,
          "NEC Report Request",
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
}
