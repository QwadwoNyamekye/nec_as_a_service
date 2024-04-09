import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NbWindowService, NbDialogService } from "@nebular/theme";
import { AddUserFormComponent } from "./add-user-form/add-user-form.component";
import { NecService } from "../../../@core/mock/nec.service";
import { EditUserFormComponent } from "./edit-user-form/edit-user-form.component";
import { UnlockUserComponent } from "./unlock-user/unlock-user.component";
import { ResetUserPasswordComponent } from "./reset-user-password/reset-user-password.component";
import { DomSanitizer } from "@angular/platform-browser";
import { ChangeUserStatusComponent } from "./change-user-status/change-user-status.component";
import { DeleteUserComponent } from "./delete-user/delete-user.component";

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
  users: any;
  row: any;

  ngOnInit(): void {
    this.getUsers();
    this.listener = (event: MessageEvent) => {
      this.receivedData = event.data;
      this.source.load(this.receivedData?.data);
    };
    window.addEventListener("message", this.listener);
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
      custom: [
        {
          name: "edit",
          title:
            '<i class="nb-edit" data-toggle="tooltip" data-placement="top" title="Edit User"></i>',
        },
        {
          name: "unlock",
          title:
            '<i class="nb-locked" data-toggle="tooltip" data-placement="top" title="Unlock User"></i>',
        },
        {
          name: "reset",
          title:
            '<i class="nb-loop-circled" data-toggle="tooltip" data-placement="top" title="Reset User"></i>',
        },
        {
          name: "userStatus",
          title:
            '<i class="nb-alert" data-toggle="tooltip" data-placement="top" title="Enable/Disable User"></i>',
        },
        {
          name: "delete",
          title:
            '<i class="nb-trash" data-toggle="tooltip" data-placement="top" title="Delete User"></i>',
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
        valuePrepareFunction: (cell, row) => {
          return this.getHtmlForLockCell(row.locked);
        },
      },
      userStatus: {
        title: "User Status",
        type: "html",
        valuePrepareFunction: (cell, row) => {
          return this.getHtmlForStatusCell(row.status);
        },
      },
    },
  };

  constructor(
    private service: NecService,
    private windowService: NbWindowService,
    private dialogService: NbDialogService,
    private domSanitizer: DomSanitizer,
    private cd: ChangeDetectorRef
  ) {}
  compare(a, b) {
    return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();
  }
  getUsers() {
    this.service.getUsers(this.service.user.email).subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {},
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
          title: "Change User Status",
          email: event.data.email,
          status: event.data.status,
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
          title: "Unlock User",
          email: event.data.email,
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
          title: "Reset User Password",
          email: event.data.email,
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
          title: "Delete User " + event.data?.name + "?",
          data: event.data,
        },
      })
      .onClose.subscribe(() => {
        this.getUsers();
      });
  }
}
