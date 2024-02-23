/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Location } from "@angular/common";

import { NbAuthService } from "@nebular/auth";
import { takeWhile } from "rxjs/operators";
import { NecService } from "../../@core/mock/nec.service";

@Component({
  selector: "nb-auth",
  styleUrls: ["./auth.component.scss"],
  templateUrl: "./auth.component.html",
})
export class NbAuthComponent implements OnDestroy, OnInit {
  private alive = true;

  subscription: any;

  authenticated: boolean = false;
  token: string = "";

  // showcase of how to use the onAuthenticationChange method
  constructor(
    protected auth: NbAuthService,
    protected location: Location,
    private service: NecService
  ) {
    this.subscription = auth
      .onAuthenticationChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe((authenticated: boolean) => {
        this.authenticated = authenticated;
      });
  }
  ngOnInit(): void {
    // this.service.initializeWebSocketConnection();
  }

  back() {
    this.location.back();
    return false;
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
