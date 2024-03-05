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

@Component({
  selector: "ngx-single",
  templateUrl: "./single.component.html",
  styleUrls: ["./single.component.scss"],
})
export class SingleNECComponent implements OnInit, OnDestroy {
  source: LocalDataSource = new LocalDataSource();
  users: any;
  stompClient: any;
  response: any;
  listener: any;
  receivedData: any;

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
    this.getSingleNECRequests();
  }
  compare(a, b) {
    return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();
  }
  getSingleNECRequests() {
    this.service.getSingleNECList(this.service.user.email).subscribe(
      (response: any) => {
        console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS");
        console.log(response);
        this.users = response.data;
      },
      (error) => {
        console.log(error);
      },
      () => {
        console.log(this.users.sort(this.compare));
        this.source.load(this.users.sort(this.compare));
      }
    );
  }

  ngOnInit() {
    this.listener = (event: MessageEvent) => {
      this.receivedData = event.data;
      this.source.load(this.receivedData);
      console.log(this.receivedData);
    };
    window.addEventListener("message", this.listener);
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
          console.log("WWWWWWWWWWWWWWWWWWW");
          console.log(event);
        },
        (error) => {},
        () => {
          console.log("ON CLOSE");
          this.getSingleNECRequests();
        }
      );
  }

  downloadAsCSV() {
    const options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalseparator: ".",
      showLabels: true,
      showTitle: true,
      useBom: true,
      headers: [
        "Destination Institution Code",
        "Destination Institution",
        "Destination Account",
        "Account Name",
        "Src. Institution Code",
        "Src. Institution",
        "Action Code",
        "Created By",
      ],
    };
    console.log("::::::::::::::::::::::")
    console.log(this.source.getAll())
    this.source.getFilteredAndSorted().then((data) => {
      new Angular5Csv(data, "report", options);
    });
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
