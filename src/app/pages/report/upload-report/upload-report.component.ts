import { Component, OnInit, OnDestroy } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NbWindowService } from "@nebular/theme";
import { NecService } from "../../../@core/mock/nec.service";
import { DatePipe } from "@angular/common";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NbToastrService, NbComponentShape, NbComponentStatus, NbDateService } from "@nebular/theme"; //NbWindowRef

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
      perPage: 15,
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

    if(this.service.user.role_id == '2' || this.service.user.role_id == '3' || this.service.user.role_id == '4'){
      this.institutionCode = this.service.user.institutionCode
      this.showInstitution = false
    }

    this.max = this.dateService.addDay(this.dateService.today(), 0);
    
    window.addEventListener("message", this.listener);
    // this.service.initializeWebSocketConnection()

    this.form = new FormGroup({
      status: new FormControl("", Validators.required),
      endDate: new FormControl("", Validators.required),
      startDate: new FormControl("", Validators.required),
      code: new FormControl("", Validators.required)
    });


    this.service.getInstitutions().subscribe(
      (data) => {
        this.institutions = data;
      },
      (error) => {
        console.log(error);
      },
      () => {
        //console.log(this.institutions.sort(this.compare));
        //this.source.load(this.institutions.sort(this.compare));
      }
    );

    this.service.getUploadStatus().subscribe(
      (data) => {
        this.uploadStatus = data;
      },
      (error) => {
        console.log(error);
      },
      () => {
        //console.log(this.institutions.sort(this.compare));
        //this.source.load(this.institutions.sort(this.compare));
      }
    );
  }



  compare( a, b ) {
    return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
  }
  // getUsers() {
  //   this.service.getSingleNECList().subscribe(
  //     (data) => {
  //       this.users = data;
  //     },
  //     (error) => {
  //       console.log(error);
  //     },
  //     () => {
  //       console.log(this.users.sort(this.compare));
  //       this.source.load(this.users.sort(this.compare));
  //     }
  //   );
  // }

  

  ngOnDestroy() {
    window.removeEventListener("message", this.listener);
  }

  // makeNECRequest() {
  //   this.response = this.
  //     .open(SingleNECRequestComponent, {
  //       title: `Make NEC Request`,
  //       windowClass: `admin-form-window`,
  //     })
  //     .onClose.subscribe(() => {
  //       this.getUsers();
  //     });
  // }

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
   

 
    this.form.value.endDate.setHours('23')
    this.form.value.endDate.setMinutes('59')
    this.form.value.endDate.setSeconds('59')
    this.form.value.endDate.setMilliseconds('999')
    this.form.value.code= this.institutionCode ? this.institutionCode : this.form.value.code

    this.service.getNecReport(this.form.value).subscribe(
      (response) => {
        console.log(response);
        this.response = response;
        this.source.load(this.response)
        return response;
      },
      (error) => {
        console.error(error);
        this.toastrService.warning(
          "NEC Report Request Failed: " + error.error.errorMessage,
          "NEC Report Request",
          {
            status: "danger",
            destroyByClick: true,
            duration: 100000,
          }
        );
      },
      () => {
        //console.log(this.response);
        // this.toastrService.success(
        //   "NEC Report Request Success",
        //   "NEC Report Request",
        //   {
        //     status: "success",
        //     destroyByClick: true,
        //     duration: 100000,
        //   }
        // );
        //this.windowRef.close();
      }
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
      this.name = "SUBMITTED";
    } else if (value === "2") {
      this.colour = "yellow";
      this.name = "PROCESSING";
    } else {
      this.colour = "green";
      this.name = "COMPLETED";
    }
    return this.domSanitizer.bypassSecurityTrustHtml(
      `<nb-card-body style="background-color: ${this.colour}; border-radius: 12px; padding-top: 7px; padding-bottom: 7px;">${this.name}</nb-card-body>`
    );
  }
}
