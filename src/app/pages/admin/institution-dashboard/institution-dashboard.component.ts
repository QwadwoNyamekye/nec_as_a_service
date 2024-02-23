import { Component, OnInit } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NbWindowService, NbDialogService } from "@nebular/theme";
import { NecService } from "../../../@core/mock/nec.service";
import { AddInstitutionFormComponent } from "./add-institution-form/add-institution-form.component";
import { DomSanitizer } from "@angular/platform-browser";
import { EditInstitutionFormComponent } from "./edit-institution-form/edit-institution-form.component";
import { ChangeInstitutionStatusComponent } from "./change-institution-status/change-institution-status.component";
import { DatePipe } from '@angular/common';

@Component({
  selector: "ngx-admin-institution-dashboard",
  templateUrl: "./institution-dashboard.component.html",
  styleUrls: ["./institution-dashboard.component.scss"],
})
export class InstitutionDashboardComponent implements OnInit{
  colour: string;
  name: string;
  getHtmlForCell(value: string) {
    if (value) {
      this.colour = "red";
      this.name = "LOCKED";
    } else {
      this.colour = "green";
      this.name = "UNLOCKED";
    }
    return this.domSanitizer.bypassSecurityTrustHtml(
      `<nb-card-body style="color:white; background-color: ${this.colour}; border-radius: 30px; padding-top: 7px; padding-bottom: 7px;">${this.name}</nb-card-body>`
    );
  }
  settings = {
    pager: {
      perPage: 15,
    },
    hideSubHeader: true,
    actions: {
      position: "right",
      custom: [
        {
          name: "edit",
          title: '<i class="nb-edit"></i>',
        },
        {
          name: "unlock",
          title: '<i class="nb-locked"></i>',
        },
      ],
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
      name: {
        title: "Institution",
        type: "string",
      },
      createdBy: {
        title: "Created By",
        type: "string",
      },
      status: {
        title: "Status",
        type: "html",
        valuePrepareFunction: (status) => {
          return this.getHtmlForCell(status);
        },
      },
      phone: {
        title: "Phone",
        type: "string",
      },
      createdAt: {
        title: "Created By",
        type: "string",
        valuePrepareFunction: (date) => {
          return new DatePipe('en-US').transform(date, 'YYYY-MM-dd HH:m:ss');
        },
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();
  listener: any;
  receivedData: any;

  institutions: any;

  ngOnInit(): void {
    this.listener = (event: MessageEvent) => {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>");
      this.receivedData = event.data;
      this.source.append(this.receivedData.institution)
      console.log(this.receivedData);
    };
    window.addEventListener("message", this.listener);
    // this.service.initializeWebSocketConnection()
  }

  constructor(
    private service: NecService,
    private windowService: NbWindowService,
    private dialogService: NbDialogService,
    private domSanitizer: DomSanitizer
  ) {
    this.service.getInstitutions().subscribe(
      (data) => {
        this.institutions = data;
      },
      (error) => {
        console.log(error);
      },
      () => {
        console.log(this.institutions);
        this.source.load(this.institutions);
      }
    );
  }

  customFunction(event) {
    if (event.action == "edit") {
      this.editInstitution();
    } else if (event.action == "unlock") {
      this.changeInstitutionStatus();
    }
  }
  editInstitution(): void {
    this.windowService.open(EditInstitutionFormComponent, {
      title: `Edit Institution`,
      windowClass: `admin-form-window`,
    });
  }
  changeInstitutionStatus(): void {
    this.dialogService.open(ChangeInstitutionStatusComponent, {
      context: {
        title: "Change Institution Status",
      },
    });
  }

  openWindowForm() {
    this.windowService.open(AddInstitutionFormComponent, {
      title: `Add Institution`,
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
  onCreateConfirm(event: any): void {
    console.log(event);
  }
  editData(event: any): void {
    console.log(Event);
  }
  onDeleteConfirm(event): void {
    if (window.confirm("Are you sure you want to delete?")) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
