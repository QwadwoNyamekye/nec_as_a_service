import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { NbDialogService, NbWindowService } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { NecService } from "../../../@core/mock/nec.service";
import { AddInstutionUserFormComponent } from "./add-institution-user-form/add-institution-user-form.component";
import { ChangeInstitutionUserStatusComponent } from "./change-institution-user-status/change-institution-user-status.component";
import { DeleteInstitutionUserComponent } from "./delete-institution-user/delete-institution-user.component";
import { EditInstitutionUserFormComponent } from "./edit-institution-user-form/edit-institution-user-form.component";
import { ResetInstitutionUserPasswordComponent } from "./reset-institution-user-password/reset-institution-user-password.component";
import { UnlockInstitutionUserComponent } from "./unlock-institution-user/unlock-institution-user.component";

@Component({
  selector: "ngx-admin-institution-user-dashboard",
  templateUrl: "./institution-user-dashboard.component.html",
  styleUrls: ["./institution-user-dashboard.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class InstitutionUserDashboardComponent implements OnInit {
  colour: string;
  name: string;
  listener: any;
  receivedData: any;
  source: LocalDataSource = new LocalDataSource();
  users: any;
  form: FormGroup;
  loading: boolean;
  showInstitution: any;
  bankList: any;
  selected = "";
  bankCode = this.necService.user.bankCode;

  ngOnInit(): void {
    this.getBanksByInstitution();
    this.listener = (event: MessageEvent) => {
      this.receivedData = event.data;
      this.source.load(this.receivedData?.data);
    };
    window.addEventListener("message", this.listener);
    this.form = new FormGroup({
      bank: new FormControl(this.bankCode, Validators.required),
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
    },
  };

  constructor(
    protected necService: NecService,
    private windowService: NbWindowService,
    private dialogService: NbDialogService,
    private domSanitizer: DomSanitizer
  ) {}

  compare(a, b) {
    return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();
  }

  getUsers(code?, type?) {
    console.log("++++++++++++++++");
    console.log(this.form);
    console.log(this.form.value.bank.type);
    this.necService
      .getUsersByInstitution(
        this.necService.user.email,
        code ? code : this.form.value.bank.code,
        type ? type : this.form.value.bank.type
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

  getBanksByInstitution() {
    this.necService
      .getInstitutionsByBank(this.necService.user.institutionCode)
      .subscribe(
        (data) => {
          this.bankList = data;
          // if (this.necService.user.roleId == "1") {
          this.bankList = this.bankList.filter(
            (bank) => !bank.code.includes("INS-NEC-0000")
          );
          // }
        },
        (_error) => {},
        () => {
          this.bankList = this.bankList.sort(this.compare);
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
      .open(AddInstutionUserFormComponent, {
        title: `Add User`,
        windowClass: `admin-form-window`,
      })
      .onClose.subscribe((event) => {
        if (event) {
          this.selected = event;
          this.getUsers(event);
        }
      });
  }

  editUser(event): void {
    this.windowService
      .open(EditInstitutionUserFormComponent, {
        title: `Edit User`,
        windowClass: `admin-form-window`,
        context: {
          currentValues: event.data,
        },
      })
      .onClose.subscribe(() => {
        this.getUsers(event.data.code, event.data.type);
      });
  }

  changeUserStatus(event): void {
    this.dialogService
      .open(ChangeInstitutionUserStatusComponent, {
        context: {
          title: "Change User Status: " + event.data.name,
          email: event.data.email,
          status: event.data.status,
        },
      })
      .onClose.subscribe(() => {
        this.getUsers(event.data.code, event.data.type);
      });
  }

  unlockUser(event): void {
    this.dialogService
      .open(UnlockInstitutionUserComponent, {
        context: {
          title: "Unlock User: " + event.data.name,
          email: event.data.email,
        },
      })
      .onClose.subscribe(() => {
        this.getUsers(event.data.code, event.data.type);
      });
  }

  resetUserPassword(event): void {
    this.dialogService
      .open(ResetInstitutionUserPasswordComponent, {
        context: {
          title: "Reset User Password for User: " + event.data.name,
          email: event.data.email,
        },
      })
      .onClose.subscribe(() => {
        this.getUsers(event.data.code, event.data.type);
      });
  }

  deleteUser(event): void {
    this.dialogService
      .open(DeleteInstitutionUserComponent, {
        context: {
          title: "Delete User: " + event.data?.name,
          data: event.data,
        },
      })
      .onClose.subscribe(() => {
        this.getUsers(event.data.code, event.data.type);
      });
  }
}
