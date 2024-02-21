import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class SingleNECService {
  constructor(private http: HttpClient) {}

  baseUrl = "http://172.27.21.210:8089/single/api/v1";
  bankUrl = "http://172.27.10.230:8003";

  getBanks() {
    return this.http
      .get(this.bankUrl + "/blaster/api/v1/banks")
      .pipe(map((response) => response));
  }
  getSingleNECList() {
    return this.http
      .get(this.baseUrl + "/nec_list")
      .pipe(map((response) => response));
  }

  makeSingleNECRequest(data) {
    console.log(data);
    return this.http
      .post(this.baseUrl + "/nec", data)
      .pipe(map((response) => response))
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => console.error(error)
      );
  }
}
