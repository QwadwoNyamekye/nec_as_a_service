import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class InstitutionDashboardService {
  constructor(private http: HttpClient) {}

  baseUrl = "http://172.27.21.210:8089/institution/api/v1";

  getInstitutions() {
    return this.http
      .get(this.baseUrl + "/get_institutions")
      .pipe(map((response) => response));
  }

  addInstitution(data) {
    console.log(data);
    return this.http
      .post(this.baseUrl + "/create_institution", data)
      .pipe(map((response) => response))
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => console.error(error)
      );
  }

  editInstitution(data) {
    console.log(data);
    return this.http
      .post(this.baseUrl + "/update_institution", data)
      .pipe(map((response) => response))
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => console.error(error)
      );
  }

  changeInstitutionStatus(data) {
    console.log(data);
    return this.http
      .post(this.baseUrl + "/change_status", data)
      .pipe(map((response) => response))
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => console.error(error)
      );
  }
}
