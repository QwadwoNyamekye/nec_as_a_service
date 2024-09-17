import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { NbDialogService, NbWindowService } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { NecService } from "../../../@core/mock/nec.service";
import { AddInstitutionFormComponent } from "./add-institution-form/add-institution-form.component";
import { AuthorizeInstutionCreationComponent } from "./authorize-institution-creation/authorize-institution-creation";
import { ChangeInstitutionStatusComponent } from "./change-institution-status/change-institution-status.component";
import { EditInstitutionFormComponent } from "./edit-institution-form/edit-institution-form.component";

@Component({
  selector: "ngx-admin-institution-dashboard",
  templateUrl: "./institution-dashboard.component.html",
  styleUrls: ["./institution-dashboard.component.scss"],
})
export class InstitutionDashboardComponent implements OnInit {
  colour: string;
  name: string;
  source: LocalDataSource = new LocalDataSource();
  listener: any;
  receivedData: any;
  institutions: any = [];
  row: any;
  label = this.getLabel();

  getLabel() {
    if (this.necService.user.type == "G") {
      return "Bank";
    } else if (this.necService.user.type == "B") {
      return "Corporate";
    }
  }

  getHtmlForCell(value: string) {
    if (value) {
      this.colour = "green";
      this.name = "ENABLED";
    } else {
      this.colour = "red";
      this.name = "DISABLED";
    }
    return this.domSanitizer.bypassSecurityTrustHtml(
      `<nb-card-body style="color:white; background-color: ${this.colour}; border-radius: 30px; padding-top: 7px; padding-bottom: 7px;">${this.name}</nb-card-body>`
    );
  }

  getHtmlForAuthorizedCell(value: string) {
    if (value) {
      this.colour = "green";
      this.name = "AUTHORIZED";
    } else {
      this.colour = "red";
      this.name = "UNAUTHORIZED";
    }
    return this.domSanitizer.bypassSecurityTrustHtml(
      `<nb-card-body style="color:white; background-color: ${this.colour}; border-radius: 30px; padding-top: 7px; padding-bottom: 7px;">${this.name}</nb-card-body>`
    );
  }

  settings = {
    pager: {
      perPage: 13,
    },
    // hideSubHeader: true,
    actions: {
      position: "right",
      custom: [
        {
          name: "authorize",
          title:
            '<i class="nb-checkmark" data-toggle="tooltip" data-placement="top" title="Authorize Institution"></i>',
        },
        {
          name: "edit",
          title:
            '<i class="nb-edit" data-toggle="tooltip" data-placement="top" title="Edit Institution"></i>',
        },
        {
          name: "unlock",
          title:
            '<i class="nb-locked" data-toggle="tooltip" data-placement="top" title="Change Institution Status"></i>',
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
      fee: {
        title: "Fee",
        type: "string",
      },
      authorized: {
        title: "Authorized",
        type: "html",
        valuePrepareFunction: (_cell, row) => {
          return this.getHtmlForAuthorizedCell(row.authorized);
        },
      },
      createdAt: {
        title: "Created By",
        type: "string",
        valuePrepareFunction: (date) => {
          return new DatePipe("en-US").transform(date, "YYYY-MM-dd HH:mm:ss");
        },
      },
    },
  };

  ngOnInit(): void {
    // this.listener = (event: MessageEvent) => {
    // this.receivedData = event.data.data;
    // this.source.load(this.receivedData.data);
    // };
    // window.addEventListener("message", this.listener);
    this.getInstitutions();
  }

  constructor(
    private necService: NecService,
    private windowService: NbWindowService,
    private dialogService: NbDialogService,
    private domSanitizer: DomSanitizer
  ) {}

  compare(a, b) {
    return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();
  }

  getInstitutions() {
    this.necService
      .getInstitutionsByBank(this.necService.user.institutionCode)
      .subscribe(
        (data) => {
          this.institutions = data;
          this.institutions = this.institutions.filter(
            (bank) => !bank.code.includes("INS-NEC-0000")
          );
        },
        (error) => {},
        () => {
          this.institutions = this.institutions.sort(this.compare);
          this.source.load(this.institutions);
        }
      );
  }

  customFunction(event) {
    if (event.action == "authorize") {
      this.authorizeInstitution(event);
    } else if (event.action == "edit") {
      this.editInstitution(event);
    } else if (event.action == "unlock") {
      this.changeInstitutionStatus(event);
    }
  }

  editInstitution(event): void {
    this.windowService
      .open(EditInstitutionFormComponent, {
        title: `Edit Institution:`,
        windowClass: `admin-form-window`,
        context: {
          currentValues: event.data,
        },
      })
      .onClose.subscribe(() => {
        this.getInstitutions();
      });
  }
  authorizeInstitution(event): void {
    this.dialogService
      .open(AuthorizeInstutionCreationComponent, {
        context: {
          title: "Authorize Institution Creation: " + event.data.name,
          authorized: event.data.authorized,
          code: event.data.code,
        },
      })
      .onClose.subscribe(() => {
        this.getInstitutions();
      });
  }

  changeInstitutionStatus(event): void {
    this.dialogService
      .open(ChangeInstitutionStatusComponent, {
        context: {
          title: "Change Institution Status: " + event.data.name,
          status: event.data.status,
          code: event.data.code,
        },
      })
      .onClose.subscribe(() => {
        this.getInstitutions();
      });
  }

  addInstitution(event) {
    this.row = event.data;
    this.windowService
      .open(AddInstitutionFormComponent, {
        title: `Add Institution`,
        windowClass: `admin-form-window`,
      })
      .onClose.subscribe(() => {
        this.getInstitutions();
      });
  }

  onEditRowSelect(event): void {
    if (window.open()) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
