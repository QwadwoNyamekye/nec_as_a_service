import { Component, OnInit } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NbWindowService, NbDialogService } from "@nebular/theme";
import { NecService } from "../../../@core/mock/nec.service";
import { AddInstitutionFormComponent } from "./add-institution-form/add-institution-form.component";
import { DomSanitizer } from "@angular/platform-browser";
import { EditInstitutionFormComponent } from "./edit-institution-form/edit-institution-form.component";
import { ChangeInstitutionStatusComponent } from "./change-institution-status/change-institution-status.component";
import { DatePipe } from "@angular/common";
import { environment } from "../../../../environments/environment.prod";

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
  institutions: any;
  row: any;
  customActions = this.setAccessibles();

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

  setAccessibles() {
    if (this.service.user.roleId == "1") {
      return [
        {
          name: "edit",
          title: '<i class="nb-edit"></i>',
        },
        {
          name: "unlock",
          title: '<i class="nb-locked"></i>',
        },
      ];
    }
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
          name: "edit",
          title: '<i class="nb-edit" data-toggle="tooltip" data-placement="top" title="Edit Institution"></i>',
        },
        {
          name: "unlock",
          title: '<i class="nb-locked" data-toggle="tooltip" data-placement="top" title="Change Institution Status"></i>',
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
          return new DatePipe("en-US").transform(date, "YYYY-MM-dd HH:mm:ss");
        },
      },
    },
  };

  ngOnInit(): void {
    this.listener = (event: MessageEvent) => {
      this.receivedData = event.data.data;
      this.source.load(this.receivedData?.data);
    };
    window.addEventListener("message", this.listener);
    
  }

  constructor(
    private service: NecService,
    private windowService: NbWindowService,
    private dialogService: NbDialogService,
    private domSanitizer: DomSanitizer
  ) {
    this.getInstitutions();
  }

  compare( a, b ) {
    return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
  }

  getInstitutions() {
    this.service.getInstitutions().subscribe(
      (data) => {
        this.institutions = data;
      },
      (error) => {
      },
      () => {
        this.institutions = this.institutions.sort(this.compare);
        this.source.load(this.institutions);
      }
    );
  }

  customFunction(event) {
    if (event.action == "edit") {
      this.editInstitution(event);
    } else if (event.action == "unlock") {
      this.changeInstitutionStatus(event);
    }
  }

  editInstitution(event): void {
    this.windowService
      .open(EditInstitutionFormComponent, {
        title: `Edit Institution`,
        windowClass: `admin-form-window`,
        context: {
          currentValues: event.data,
        },
      })
      .onClose.subscribe(
        () => {
          this.getInstitutions();
        }
      );
  }

  changeInstitutionStatus(event): void {
    this.dialogService
      .open(ChangeInstitutionStatusComponent, {
        context: {
          title: "Change Institution Status",
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
