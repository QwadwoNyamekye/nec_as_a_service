import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { NbDialogService, NbWindowService } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { NecService } from "../../../@core/mock/nec.service";
import { AddUserFormComponent } from "./add-user-form/add-user-form.component";
import { ChangeUserStatusComponent } from "./change-user-status/change-user-status.component";
import { DeleteUserComponent } from "./delete-user/delete-user.component";
import { EditUserFormComponent } from "./edit-user-form/edit-user-form.component";
import { ResetUserPasswordComponent } from "./reset-user-password/reset-user-password.component";
import { UnlockUserComponent } from "./unlock-user/unlock-user.component";
import { AuthorizeInstitutionUserComponent } from "../institution-user/authorize-institution-user/authorize-institution-user.component";
import { ActionsRendererComponent } from "./actions-component/actions.component";
import { EventService } from "./event.service";

@Component({
  selector: "ngx-admin-dashboard",
  templateUrl: "./user-dashboard.component.html",
  styleUrls: ["./user-dashboard.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AdminDashboardComponent implements OnInit {
  colour: string;
  name: string;
  listener: any;
  receivedData: any;
  source: LocalDataSource = new LocalDataSource();
  users: any = [];
  row: any;

  ngOnInit(): void {
    this.getUsers();

    // this.listener = (event: MessageEvent) => {
    //   this.receivedData = event.data;
    //   this.source.load(this.receivedData?.data);
    // };
    // window.addEventListener("message", this.listener);

    this.eventService.customClick$.subscribe((event) => {
      this.customFunction(event);
    });
  }

  getHtmlForStatusCell(value: string) {
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

  getHtmlForLockCell(value: string) {
    if (value) {
      this.colour = "red";
      this.name = "YES";
    } else {
      this.colour = "green";
      this.name = "NO";
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
      deleteButtonContent: '<i class="nb-compose" aria-hidden="true"></i>',
      confirmDelete: true,
    },
    columns: {
      name: {
        title: "Name",
        type: "string",
      },
      email: {
        title: "Email Address",
        type: "string",
      },
      roleName: {
        title: "Role",
        type: "string",
      },
      authorized: {
        title: "Authorized",
        type: "html",
        valuePrepareFunction: (_cell, row) => {
          return this.getHtmlForAuthorizedCell(row.authorized);
        },
      },
      institutionName: {
        title: "Institution Name",
        type: "string",
      },
      phone: {
        title: "Phone",
        type: "string",
      },
      locked: {
        title: "Locked",
        type: "html",
        valuePrepareFunction: (_cell, row) => {
          return this.getHtmlForLockCell(row.locked);
        },
      },
      userStatus: {
        title: "User Status",
        type: "html",
        valuePrepareFunction: (_cell, row) => {
          return this.getHtmlForStatusCell(row.status);
        },
      },
      actions: {
        title: "Actions",
        type: "custom",
        renderComponent: ActionsRendererComponent,
        filter: false,
        sort: false,
      },
    },
  };

  constructor(
    private necService: NecService,
    private windowService: NbWindowService,
    private dialogService: NbDialogService,
    private domSanitizer: DomSanitizer,
    private eventService: EventService
  ) {}
  compare(a, b) {
    return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();
  }

  getUsers(_code?, _type?) {
    this.necService
      .getUsersByInstitution(
        this.necService.user.email,
        this.necService.user.institutionCode,
        this.necService.user.type
      )
      .subscribe(
        (data) => {
          this.users = data;
        },
        (_error) => {},
        () => {
          this.users = this.users.sort(this.compare);
          this.source.load(this.users);
        }
      );
  }

  customFunction(event) {
    if (event.action == "unlock") {
      this.unlockUser(event);
    } else if (event.action == "edit") {
      this.editUser(event);
    } else if (event.action == "userStatus") {
      this.changeUserStatus(event);
    } else if (event.action == "reset") {
      this.resetUserPassword(event);
    } else if (event.action == "delete") {
      this.deleteUser(event);
    } else if (event.action == "authorize") {
      this.authorizeUser(event);
    }
  }

  addUser() {
    this.windowService
      .open(AddUserFormComponent, {
        title: `Add User`,
        windowClass: `admin-form-window`,
      })
      .onClose.subscribe(() => {
        this.getUsers();
      });
  }

  authorizeUser(event): void {
    this.dialogService
      .open(AuthorizeInstitutionUserComponent, {
        context: {
          title: "Authorize User Creation: " + event.data?.name + "?",
          data: event.data,
        },
      })
      .onClose.subscribe(() => {
        this.getUsers(event.data.code, event.data.type);
      });
  }

  editUser(event): void {
    this.row = event;
    this.windowService
      .open(EditUserFormComponent, {
        title: `Edit User`,
        windowClass: `admin-form-window`,
        context: {
          currentValues: event.data,
        },
      })
      .onClose.subscribe(() => {
        this.getUsers();
      });
  }

  changeUserStatus(event): void {
    this.dialogService
      .open(ChangeUserStatusComponent, {
        context: {
          currentValues: event.data,
        },
      })
      .onClose.subscribe(() => {
        this.getUsers();
      });
  }

  unlockUser(event): void {
    this.dialogService
      .open(UnlockUserComponent, {
        context: {
          currentValues: event.data,
        },
      })
      .onClose.subscribe(() => {
        this.getUsers();
      });
  }

  resetUserPassword(event): void {
    this.dialogService
      .open(ResetUserPasswordComponent, {
        context: {
          currentValues: event.data,
        },
      })
      .onClose.subscribe(() => {
        this.getUsers();
      });
  }

  deleteUser(event): void {
    this.dialogService
      .open(DeleteUserComponent, {
        context: {
          currentValues: event.data,
        },
      })
      .onClose.subscribe(() => {
        this.getUsers();
      });
  }
}
