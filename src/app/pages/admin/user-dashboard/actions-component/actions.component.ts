import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  HostListener,
} from "@angular/core";
import { UserEventService } from "../event.service";
import { NecService } from "../../../../@core/mock/nec.service";

@Component({
  selector: "app-custom-renderer",
  template: `<div
    class="dropdown"
    (mouseenter)="onMouseEnter()"
    (mouseleave)="onMouseLeave()"
  >
    <button class="dropdown-button"><i class="fa fa-cog"></i></button>
    <div class="dropdown-content" [ngStyle]="dropdownStyle" *ngIf="isOpen">
      <button class="dropdown-item" (click)="onClick('authorize')">
        <i
          class="fa fa-check"
          data-toggle="tooltip"
          data-placement="top"
          title="Authorize User Creation"
        ></i>
        Authorize
      </button>
      <button class="dropdown-item" (click)="onClick('edit')">
        <i
          class="fa fa-edit"
          data-toggle="tooltip"
          data-placement="top"
          title="Edit User"
        ></i>
        Edit
      </button>
      <button class="dropdown-item" (click)="onClick('unlock')">
        <i
          class="fa fa-unlock"
          data-toggle="tooltip"
          data-placement="top"
          title="Unlock User"
        ></i>
        Unlock
      </button>
      <button class="dropdown-item" (click)="onClick('reset')">
        <i
          class="fa fa-undo"
          data-toggle="tooltip"
          data-placement="top"
          title="Reset Password"
        ></i>
        Reset
      </button>
      <button
        *ngIf="this.rowData.status == false"
        class="dropdown-item"
        (click)="onClick('userStatus')"
      >
        <i
          class="fa fa-thumbs-up"
          data-toggle="tooltip"
          data-placement="top"
          title="Enable User"
        ></i>
        Enable
      </button>
      <button
        *ngIf="this.rowData.status == true"
        class="dropdown-item"
        (click)="onClick('userStatus')"
      >
        <i
          class="fa fa-thumbs-down"
          data-toggle="tooltip"
          data-placement="top"
          title="Disable User"
        ></i>
        Disable
      </button>
      <button class="dropdown-item" (click)="onClick('delete')">
        <i
          class="fa fa-trash"
          data-toggle="tooltip"
          data-placement="top"
          title="Delete User"
        ></i>
        Delete
      </button>
    </div>
  </div>`,
  styleUrls: ["./actions.component.scss"],
})
export class ActionsRendererComponent implements OnInit {
  @Input() value: any;
  @Input() rowData: any;
  @Output() customClick = new EventEmitter<any>();
  dropdownToggle = document.querySelector(".dropdown-button");
  dropdownMenu = document.querySelector(".dropdown-content");
  public isOpen = false;
  public dropdownStyle = {};

  constructor(
    private eventService: UserEventService,
    protected necService: NecService
  ) {}

  ngOnInit(): void {}

  event = { action: "", data: {} }; //to match the expected data structure in the main components

  onClick(event) {
    this.event.action = event;
    this.event.data = this.rowData;
    this.eventService.emitCustomClick(this.event); // Emit the row data through the service
  }

  onMouseEnter() {
    this.isOpen = true;
    this.updateDropdownPosition();
  }

  onMouseLeave() {
    this.isOpen = false;
  }

  updateDropdownPosition() {
    const dropdownMenu = document.querySelector(
      ".dropdown-menu"
    ) as HTMLElement;
    if (dropdownMenu) {
      const rect = dropdownMenu.getBoundingClientRect();
      if (rect.bottom > window.innerHeight) {
        this.dropdownStyle = { bottom: "100%" }; // Move it up
      } else {
        this.dropdownStyle = {}; // Reset if it fits
      }
    }
  }

  @HostListener("window:resize")
  onResize() {
    if (this.isOpen) {
      this.updateDropdownPosition();
    }
  }
}
