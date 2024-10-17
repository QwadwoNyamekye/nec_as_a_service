import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { EventService } from "../event.service";
import { NecService } from "../../../../../@core/mock/nec.service";

@Component({
  selector: "app-new-bulk-upload",
  template: `<div class="dropdown">
    <button class="dropdown-button"><i class="fa fa-cog"></i></button>
    <div class="dropdown-content">
      <button
        class="dropdown-item"
        (click)="onClick('process')"
        [hidden]="this.necService.user.roleId == '3'"
      >
        <i
          class="fa fa-check"
          data-toggle="tooltip"
          data-placement="top"
          title="Process"
        ></i>
        Process
      </button>
      <button
        class="dropdown-item"
        (click)="onClick('submit')"
        [hidden]="this.necService.user.roleId == '4'"
      >
        <i
          class="fa fa-edit"
          data-toggle="tooltip"
          data-placement="top"
          title="Submit"
        ></i>
        Submit
      </button>
      <button class="dropdown-item" (click)="onClick('expand')">
        <i
          class="fa fa-list"
          data-toggle="tooltip"
          data-placement="top"
          title="Expand"
        ></i>
        Expand
      </button>
      <button class="dropdown-item" (click)="onClick('reject')">
        <i
          class="fa fa-ban"
          data-toggle="tooltip"
          data-placement="top"
          title="Reject File"
        ></i>
        Reject File
      </button>
    </div>
  </div>`,
  styleUrls: ["./actions.component.scss"],
})
export class ActionsRendererComponent implements OnInit {
  @Input() value: any;
  @Input() rowData: any;
  @Output() customClick = new EventEmitter<any>();
  isInitiator: boolean = false;
  isAuthorizer: boolean = false;

  constructor(
    private eventService: EventService,
    public necService: NecService
  ) {}

  ngOnInit(): void {
    if (this.necService.user.roleId == "4") {
      this.isAuthorizer = true;
    } else if (this.necService.user.roleId == "3") {
      this.isInitiator = true;
    }
  }

  event = { action: "", data: {} };

  onClick(event) {
    this.event.action = event;
    this.event.data = this.rowData;
    this.eventService.emitCustomClick(this.event); // Emit the row data through the service
  }
}
