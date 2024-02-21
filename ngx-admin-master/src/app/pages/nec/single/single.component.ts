import { Component } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NbWindowService } from "@nebular/theme";
import { SingleNECService } from "./single.service";
import { SingleNECRequestComponent } from "./single-nec-request/single-nec-request.component";
import { DatePipe } from "@angular/common";
import { Stomp } from "@stomp/stompjs";
import * as SockJS from "sockjs-client";

@Component({
  selector: "ngx-single",
  templateUrl: "./single.component.html",
  styleUrls: ["./single.component.scss"],
})
export class SingleNECComponent {
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
      destInstitution: {
        title: "Institution Code",
        type: "string",
      },
      destInstitutionName: {
        title: "Institution",
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
      amount: {
        title: "Amount",
        type: "string",
      },
      actionCode: {
        title: "Action Code",
        type: "string",
      },
      createdAt: {
        title: "Created At",
        type: "string",
        valuePrepareFunction: (date) => {
          return new DatePipe("en-US").transform(date, "YYYY-MM-dd HH:m:ss");
        },
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  singleNECList: any;
  stompClient: any;

  constructor(
    private service: SingleNECService,
    private windowService: NbWindowService
  ) {
    this.service.getSingleNECList().subscribe(
      (data) => {
        this.singleNECList = data;
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

  initializeWebSocketConnection() {
    const serverUrl = "http://172.27.21.210:8089/nec";
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;

    this.stompClient.connect({}, function (frame) {
      that.stompClient.subscribe("/realtime/nec", (message) => {
        let txn = JSON.parse(message.body);
        console.log(txn)
      });
    });
  }


  makeNECRequest() {
    this.windowService.open(SingleNECRequestComponent, {
      title: `Make NEC Request`,
      windowClass: `admin-form-window`,
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
