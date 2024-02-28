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
      console.log(event.data);
      this.receivedData = event.data;
      this.source.load(this.receivedData.data)
      // if (this.receivedData.key == "add") {
      //   this.source.load(this.receivedData.data.user);
      // } else if (
      //   ["edit", "unlock", "reset", "status"].includes(this.receivedData.key)
      // ) {
      //   this.source.update(this.row.data, this.receivedData.data.user);
      // }
    };
    window.addEventListener("message", this.listener);
    // this.service.initializeWebSocketConnection()
  }

  getHtmlForStatusCell(value: string) {
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

  getHtmlForCell(value: string) {
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
        {
          name: "reset",
          title: '<i class="nb-loop-circled"></i>',
        },
        {
          name: "userStatus",
          title: '<i class="nb-alert"></i>',
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
      role_name: {
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
        valuePrepareFunction: (lock) => {
          return this.getHtmlForCell(lock);
        },
      },
      userStatus: {
        title: "User Status",
        type: "html",
        valuePrepareFunction: (status) => {
          return this.getHtmlForStatusCell(status);
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
  ) {
    this.getUsers()
  }
  compare( a, b ) {
    return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
  }
  getUsers() {
    this.service.getUsers().subscribe(
      (data) => {
        this.users = data;
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

  customFunction(event) {
    if (event.action == "unlock") {
      this.unlockUser(event);
    } else if (event.action == "edit") {
      this.editUser(event);
    } else if (event.action == "userStatus") {
      this.changeUserStatus(event);
    } else if (event.action == "reset") {
      this.resetUserPassword(event);
    }
  }

  addUser() {
    this.windowService.open(AddUserFormComponent, {
      title: `Add User`,
      windowClass: `admin-form-window`,
    })
    .onClose.subscribe(() => {
      this.getUsers();
    });
  }

  editUser(event): void {
    console.log(event.data);
    console.log("))))))))))))))))))))))))")
    this.row = event;
    this.windowService.open(EditUserFormComponent, {
      title: `Edit User`,
      windowClass: `admin-form-window`,
      context: {
        email: event.data.email,
        currentValues: event.data
      },
    })
    .onClose.subscribe(() => {
      this.getUsers();
    });
    // event.confirm.resolve()
  }

  changeUserStatus(event): void {
    this.dialogService.open(ChangeUserStatusComponent, {
      context: {
        title: "Change User Status",
        email: event.data.email,
      },
    })
    .onClose.subscribe(() => {
      this.getUsers();
    });
  }

  unlockUser(event): void {
    this.dialogService.open(UnlockUserComponent, {
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
    this.dialogService.open(ResetUserPasswordComponent, {
      context: {
        title: "Reset User Password",
        email: event.data.email,
      },
    })
    .onClose.subscribe(() => {
      this.getUsers();
    });
  }
}
