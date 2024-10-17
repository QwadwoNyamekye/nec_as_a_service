import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { InstitutionEventService } from "../event.service";

@Component({
  selector: "app-custom-renderer",
  template: `<div
    class="dropdown"
    (mouseenter)="onMouseEnter()"
    (mouseleave)="onMouseLeave()"
  >
    <button class="dropdown-button"><i class="fa fa-cog"></i></button>
    <div
      class="dropdown-content"
      [ngClass]="
        this.dropdownPosition
          ? 'dropdown-position-top'
          : 'dropdown-position-bottom'
      "
    >
      <button
        class="dropdown-item"
        (click)="onClick('authorize')"
        *ngIf="!this.rowData.authorized"
      >
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
          title="Reset User"
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
  dropdownPosition: boolean;
  dynamicStyles = {};

  constructor(
    private eventService: InstitutionEventService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {}

  onMouseEnter() {
    this.setDropdownDirection();
  }

  onMouseLeave() {}

  setDropdownDirection() {
    const dropdownButton = this.el.nativeElement.querySelector("button");
    const rect = dropdownButton.getBoundingClientRect();
    const spaceAbove = rect.top; // Space above the button
    const spaceBelow = window.innerHeight - rect.bottom; // Space below the button
    // Check available space and set direction
    if (spaceBelow > 150) {
      this.dropdownPosition = true; // Open upwards
    } else {
      this.dropdownPosition = false; // Open downwards
    }
  }

  event = { action: "", data: {} };

  onClick(event) {
    this.event.action = event;
    this.event.data = this.rowData;
    this.eventService.emitCustomClick(this.event); // Emit the row data through the service
  }
}
