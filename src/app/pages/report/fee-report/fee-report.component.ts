import { DatePipe } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NbDateService, NbToastrService } from "@nebular/theme";
import { Angular5Csv } from "angular5-csv/dist/Angular5-csv";
import jsPDF from "jspdf";
import autotable from "jspdf-autotable";
import { LocalDataSource } from "ng2-smart-table";
import { NecService } from "../../../@core/mock/nec.service";
import { Observable } from "rxjs";

@Component({
  selector: "ngx-fee-report",
  templateUrl: "./fee-report.component.html",
  styleUrls: ["./fee-report.component.scss"],
})
export class FeeReportComponent implements OnInit, OnDestroy {
  source: LocalDataSource = new LocalDataSource();
  users: any;
  stompClient: any;
  response: any;
  listener: any;
  receivedData: any;
  form: FormGroup;
  max: Date;
  min: Date;
  institutions: any;
  showInstitution = false;
  institutionCode;
  loading: boolean = false;
  showBank = true;
  bankList: any;
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
      batchId: {
        title: "Batch ID",
        type: "string",
      },
      createdBy: {
        title: "Created By",
        type: "string",
      },
      institutionCode: {
        title: "Institution Code",
        type: "string",
      },
      institutionName: {
        title: "Institution Name",
        type: "string",
      },
      total: {
        title: "Total Records",
        type: "string",
      },
      success: {
        title: "Success",
        type: "string",
      },
      fail: {
        title: "Fail",
        type: "string",
      },
      perTxnFee: {
        title: "Per Txn Fee",
        type: "string",
      },
      totalFee: {
        title: "Total Fee",
        type: "string",
      },
    },
  };

  constructor(
    private necService: NecService,
    private toastrService: NbToastrService,
    protected dateService: NbDateService<Date>
  ) {}

  ngOnInit() {
    // this.listener = (event: MessageEvent) => {
    //   this.receivedData = event.data;
    //   this.source.load(this.receivedData);
    // };
    // window.addEventListener("message", this.listener);

    // if (
    //   this.necService.user.roleId == "2" ||
    //   this.necService.user.roleId == "3" ||
    //   this.necService.user.roleId == "4"
    // ) {
    //   this.institutionCode = this.necService.user.institutionCode;
    //   this.showInstitution = false;
    // }

    this.max = this.dateService.addDay(this.dateService.today(), 0);

    this.form = new FormGroup({
      endDate: new FormControl("", Validators.required),
      startDate: new FormControl("", Validators.required),
      code: new FormControl(""),
      destBank: new FormControl(""),
    });

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
      body: this.response.data,
      columns: [
        { header: "Batch ID", dataKey: "batchId" },
        { header: "Created By", dataKey: "createdBy" },
        { header: "Institution Code", dataKey: "institutionCode" },
        { header: "Institution Name", dataKey: "institutionName" },
        { header: "Total Records", dataKey: "total" },
        { header: "Success", dataKey: "success" },
        { header: "Fail", dataKey: "fail" },
        { header: "Per Txn Fee", dataKey: "perTxnFee" },
        { header: "Total Fee", dataKey: "totalFee" },
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
      },
    });
    this.doc.save(
      this.necService.user.institutionCode +
        "_SINGLE_FEE_REPORT" +
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
        "Institution Name",
        "Institution Code",
        "Batch ID",
        "Total",
        "Success",
        "Fail",
        "Per Txn Fee",
        "Total Fee",
        "Created By",
      ],
    };
    new Angular5Csv(
      this.response,
      this.necService.user.institutionCode +
        "_SINGLE_FEE_REPORT" +
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

  /////////////////FORM STUFF

  onSubmit(): void {
    this.loading = true;
    this.form.value.endDate.setHours("23");
    this.form.value.endDate.setMinutes("59");
    this.form.value.endDate.setSeconds("59");
    this.form.value.endDate.setMilliseconds("999");

    var object = {
      startDate: this.form.value.startDate,
      endDate: this.form.value.endDate,
    };

    var feeRequest: Observable<object>;

    if (this.form.value.destBank === "" && this.form.value.code === "") {
      feeRequest = this.necService.getFeeLogs(object);
    } else if (this.form.value.code != "") {
      feeRequest = this.necService.getFeeLogsByInstitution(
        object,
        this.form.value.code
      );
    } else if (this.form.value.destBank != "") {
      feeRequest = this.necService.getFeeLogsByBank(
        object,
        this.form.value.destBank
      );
    }

    feeRequest.subscribe(
      (response) => {
        this.loading = false;
        this.response = response;
        this.source.load(this.response);
      },
      (error) => {
        this.loading = false;
        this.toastrService.danger(
          "Fee Report Request Failed: " + error.error.errorMessage,
          "Fee Report Request",
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
