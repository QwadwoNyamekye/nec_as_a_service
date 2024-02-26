import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NbWindowService } from "@nebular/theme";
import { NecService } from "../../../../@core/mock/nec.service";
import { DatePipe } from "@angular/common";

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
  ) {}

  ngOnInit() {
    this.service.getFileRecords(this.batchId).subscribe(
      (data) => {
        this.singleNECList = data;
        console.log(data);
      },
      (error) => {
        console.log(error);
      },
      () => {
        console.log(this.singleNECList);
        this.source.load(this.singleNECList);
      }
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
