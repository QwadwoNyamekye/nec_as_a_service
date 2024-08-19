import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EventService {
  private customClickSubject = new Subject<any>();
  customClick$ = this.customClickSubject.asObservable();

  emitCustomClick(event: any) {
    this.customClickSubject.next(event);
  }
}
