import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, catchError, timeout } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class LoginService {
  constructor(private http: HttpClient) {}

  baseUrl = "http://172.27.21.210:8089";
  data: any;

  editUser(user) {
    return this.http
      .post(this.baseUrl + "/user/api/v1/update_user", user)
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => console.error(error)
      );
  }
}
