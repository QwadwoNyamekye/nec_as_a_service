import { DatePipe } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { NbDateService, NbToastrService } from "@nebular/theme"; //NbWindowRef
import { Angular5Csv } from "angular5-csv/dist/Angular5-csv";
import jsPDF from "jspdf";
import autotable from "jspdf-autotable";
import { LocalDataSource } from "ng2-smart-table";
import { NecService } from "../../../@core/mock/nec.service";

@Component({
  selector: "ngx-upload-report",
  templateUrl: "./upload-report.component.html",
  styleUrls: ["./upload-report.component.scss"],
})
export class UploadReportComponent implements OnInit, OnDestroy {
  source: LocalDataSource = new LocalDataSource();
  users: any;
  stompClient: any;
  response: any = [];
  listener: any;
  receivedData: any;
  form: FormGroup;
  doc = new jsPDF("landscape");
  loading: boolean = false;
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
  bankList: any;
  max: Date;
  min: Date;
  startDate: Date;
  institutions: any;
  colour: string;
  name: string;
  institutionCode: any;
  showInstitution = false;
  showBank = false;
  uploadStatus: Object;

  constructor(
    private necService: NecService,
    private toastrService: NbToastrService,
    protected dateService: NbDateService<Date>,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.necService.checkJWTValid();
    this.listener = (event: MessageEvent) => {
      this.receivedData = event.data;
      this.source.load(this.receivedData);
    };

    this.max = this.dateService.addDay(this.dateService.today(), 0);

    window.addEventListener("message", this.listener);

    this.form = new FormGroup({
      startDate: new FormControl("", Validators.required),
      endDate: new FormControl("", Validators.required),
      code: new FormControl(""),
      status: new FormControl(""),
      bankCode: new FormControl(""),
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

    this.necService.getUploadStatus().subscribe(
      (data) => {
        this.uploadStatus = data;
      },
      (error) => {},
      () => {}
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

  compare(a, b) {
    return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();
  }

  setMin(event) {
    this.min = event;
  }

  downloadAsPDF() {
    var data = this.response.map((item) => {
      item.createdAt = new DatePipe("en-US").transform(
        item.createdAt,
        "YYYY-MM-dd HH:mm:ss"
      );
      item.submittedAt = new DatePipe("en-US").transform(
        item.submittedAt,
        "YYYY-MM-dd HH:mm:ss"
      );
      return item;
    });
    autotable(this.doc, {
      head: [],
      body: data,
      columns: [
        { header: "Batch ID", dataKey: "batchId" },
        { header: "Record Count", dataKey: "totalCount" },
        { header: "Description", dataKey: "description" },
        { header: "File Name", dataKey: "fileName" },
        { header: "Status", dataKey: "status" },
        { header: "Institution Code", dataKey: "institutionCode" },
        { header: "Submitted By", dataKey: "submittedBy" },
        { header: "Submitted At", dataKey: "submittedAt" },
        { header: "Authorized By", dataKey: "authorizedBy" },
        { header: "Authorized At", dataKey: "authorizedAt" },
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
      },
    });
    this.doc.save(
      this.necService.user.institutionCode +
        "_BULK_UPLOAD_REPORT" +
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
        "Batch ID",
        "Record Count",
        "Description",
        "File Name",
        "Status",
        "Institution Code",
        "Created By",
        "Authorized By",
        "Submitted By",
        "Submitted At",
        "Created At",
        "Authorized At",
      ],
    };
    new Angular5Csv(
      this.response,
      this.necService.user.institutionCode +
        "_BULK_UPLOAD_REPORT" +
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

  onSubmit(): void {
    this.loading = true;
    this.form.value.endDate.setHours("23");
    this.form.value.endDate.setMinutes("59");
    this.form.value.endDate.setSeconds("59");
    this.form.value.endDate.setMilliseconds("999");
    // this.form.value.code = this.institutionCode
    //   ? this.institutionCode
    //   : this.form.value.code;

    this.necService.getUploadReport(this.form.value).subscribe(
      (response) => {
        this.loading = false;
        this.response = response;
        this.source.load(this.response);
      },
      (error) => {
        this.loading = false;
        this.toastrService.warning(
          "Batch Report Request Failed: " + error.error.errorMessage,
          "Batch Report Request",
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

  getHtmlForCell(value: string) {
    console.log("))))))))))))))))");
    console.log(value);
    console.log(typeof value);
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
      this.colour = "yellow";
      this.name = "PROCESSING";
    } else if (value === "4") {
      this.colour = "#55DD33";
      this.name = "COMPLETED";
    }
    return this.domSanitizer.bypassSecurityTrustHtml(
      `<nb-card-body style="background-color: ${this.colour}; border-radius: 12px; padding-top: 7px; padding-bottom: 7px;">${this.name}</nb-card-body>`
    );
  }
}
