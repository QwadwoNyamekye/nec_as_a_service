import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, catchError, timeout } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class UserDashboardService {
  constructor(private http: HttpClient) {}

  baseUrl = "http://172.27.21.210:8089";

  getUsers() {
    return this.http
      .get(this.baseUrl + "/user/api/v1/get_users")
      .pipe(map((response) => response));
  }

  getInstitutions() {
    return this.http
      .get(this.baseUrl + "/institution/api/v1/get_institutions")
      .pipe(map((response) => response));
  }

  getRoles() {
    return this.http
      .get(this.baseUrl + "/user/api/v1/get_roles")
      .pipe(map((response) => response));
  }

  postUsers(user) {
    return this.http
      .post(this.baseUrl + "/user/api/v1/create_user", user)
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => console.error(error)
      );
  }

  
  unlockUser(user) {
    return this.http
      .post(
        this.baseUrl +
        "/user/api/v1/unlock_user",
        user
      )
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => console.error(error)
      );
  }
  
  changeUserStatus(user) {
    return this.http
      .post(
        this.baseUrl +
        "/user/api/v1/change_status",
        user
      )
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => console.error(error)
      );
  }
  
  resetUserPassword(user) {
    return this.http
      .post(
        this.baseUrl +
        "/user/api/v1/reset_password",
        user
      )
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => console.error(error)
      );
  }

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
