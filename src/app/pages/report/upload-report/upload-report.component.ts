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
  selector: "ngx-upload-report",
  templateUrl: "./upload-report.component.html",
  styleUrls: ["./upload-report.component.scss"],
})
export class UploadReportComponent implements OnInit, OnDestroy {
  source: LocalDataSource = new LocalDataSource();
  users: any;
  stompClient: any;
  response: any;
  listener: any;
  receivedData: any;
  form: FormGroup;
  doc = new jsPDF("landscape");
  loading: boolean = false;
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
  bankList: Object;
  max: Date;
  min: Date;
  institutions: Object;
  colour: string;
  name: string;
  domSanitizer: any;
  institutionCode: any;
  showInstitution: boolean = true;
  uploadStatus: Object;

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
      console.log(this.receivedData);
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
      status: new FormControl(""),
      endDate: new FormControl("", Validators.required),
      startDate: new FormControl("", Validators.required),
      code: new FormControl(""),
    });

    this.service.getInstitutions().subscribe(
      (data) => {
        this.institutions = data;
      },
      (error) => {
        console.log(error);
      },
      () => { }
    );

    this.service.getUploadStatus().subscribe(
      (data) => {
        this.uploadStatus = data;
      },
      (error) => {
        console.log(error);
      },
      () => { }
    );
  }

  compare(a, b) {
    return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();
  }
  setMin(event) {
    console.log("iiiiiiiiiiiiiiiiiiiii")
    this.min = event;
  }

  setMax(event) {
    console.log("MAXXXXXXXXXX")
    this.max = event;
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
    console.log("::::::::::::::::::::::");
    console.log(data);
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
      this.service.user.institutionCode + "_BULK_UPLOAD_REPORT" +
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
    console.log("::::::::::::::::::::::");
    console.log(this.response);
    new Angular5Csv(
      this.response,
      this.service.user.institutionCode + "_BULK_UPLOAD_REPORT" +
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

    this.service.getUploadReport(this.form.value).subscribe(
      (response) => {
        console.log(response);
        this.response = response;
        this.source.load(this.response);
        this.loading = false;
        return response;
      },
      (error) => {
        this.loading = false;
        console.error(error);
        this.toastrService.warning(
          "Upload Report Request Failed: " + error.error.errorMessage,
          "Upload Report Request",
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
      this.colour = "yellow";
      this.name = "PROCESSING";
    } else {
      this.colour = "#55DD33";
      this.name = "COMPLETED";
    }
  }
}
