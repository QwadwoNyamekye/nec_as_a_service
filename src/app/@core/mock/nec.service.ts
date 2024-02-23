import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, catchError, timeout } from "rxjs/operators";
import { HttpHeaders } from "@angular/common/http";
import { NbAuthService, NbAuthJWTToken } from "@nebular/auth";
import { Stomp } from "@stomp/stompjs";
import * as SockJS from "sockjs-client";
import { NbToastrService } from "@nebular/theme";

@Injectable({ providedIn: "root" })
export class NecService {
  user: any;
  constructor(
    private http: HttpClient,
    private authService: NbAuthService,
    private toastrService: NbToastrService
  ) {
    this.authService.onTokenChange().subscribe((token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.headers = new HttpHeaders().set(
          "Authorization",
          "Bearer " + token.getValue()
        );
        this.user = JSON.parse(localStorage.getItem("user")); // here we receive a payload from the token and assigns it to our `user` variable
        console.log(">>>>>>>>>>>>>>>>>");
        console.log(JSON.parse(localStorage.getItem("user")));
      }
    });
  }

  websocket = "http://172.27.21.210:8088/nec";
  baseUrl = "http://172.27.21.210:8089";
  bankUrl = "http://172.27.10.230:8003";
  data: any;
  headers: any;
  stompClient: any;

  initializeWebSocketConnection() {
    const serverUrl = this.websocket;
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    console.log("????????????????????????")
    console.log(this.stompClient.status)
    this.stompClient.connect({}, function (frame) {
      console.log("LLLLLLLLLLLLLLL");
      that.stompClient.subscribe("/realtime/alert", (message) => {
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        console.log(message);
        console.log(message.body.split(":"));
        var websocketdata = message.body.split(":");
        var websocketMessage = websocketdata[0];
        var websocketUser = websocketdata[1];
        console.log("JJJJJJJJJJJJJJJJJJJJJ");
        console.log(that.user);
        if (websocketMessage != "" && websocketUser == that.user.id) {
          that.toastrService.success(websocketMessage, "Bulk File Processing", {
            duration: 100000,
            destroyByClick: true,
            duplicatesBehaviour: 'previous',
            preventDuplicates: true
          });
        }
      });
    });
  }

  //-------------BULK--------------

  getUploads() {
    return this.http
      .get(this.baseUrl + "/upload/api/v1/get_uploads", {
        headers: this.headers,
      })
      .pipe(map((response) => response));
  }

  submitForProcessing(batchId, submittedBy) {
    return this.http
      .get(
        this.baseUrl +
          `/upload/api/v1/submit_upload_for_processing/${batchId}/${submittedBy}`,
        { headers: this.headers }
      )
      .pipe(map((response) => response));
  }

  uploadFile(file, description, createdBy, count) {
    return this.http
      .post(
        this.baseUrl +
          "/upload/api/v1/create_upload/" +
          description +
          "/" +
          createdBy +
          "/" +
          count,
        file,
        { headers: this.headers }
      )
      .pipe(map((response) => response));
  }

  //-------------------BANKS------------------
  getBanks() {
    return this.http
      .get(this.bankUrl + "/blaster/api/v1/banks", { headers: this.headers })
      .pipe(map((response) => response));
  }
  getSingleNECList() {
    return this.http
      .get(this.baseUrl + "/single/api/v1/nec_list", { headers: this.headers })
      .pipe(map((response) => response));
  }

  makeSingleNECRequest(data) {
    console.log(data);
    return this.http
      .post(this.baseUrl + "/single/api/v1/nec", data, {
        headers: this.headers,
      })
      .pipe(map((response) => response));
  }

  //-------------- USERS APIS------------------

  getUsers() {
    return this.http
      .get(this.baseUrl + "/user/api/v1/get_users", { headers: this.headers })
      .pipe(map((response) => response));
  }

  getRoles() {
    return this.http
      .get(this.baseUrl + "/user/api/v1/get_roles", { headers: this.headers })
      .pipe(map((response) => response));
  }

  postUsers(user) {
    return this.http
      .post(this.baseUrl + "/user/api/v1/create_user", user, {
        headers: this.headers,
      })
      .pipe(map((response) => response));
  }

  unlockUser(user) {
    return this.http
      .post(this.baseUrl + "/user/api/v1/unlock_user", user, {
        headers: this.headers,
      })
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => console.error(error)
      );
  }

  changeUserStatus(user) {
    return this.http
      .post(this.baseUrl + "/user/api/v1/change_status", user, {
        headers: this.headers,
      })
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => console.error(error)
      );
  }

  resetUserPassword(user) {
    return this.http
      .post(this.baseUrl + "/user/api/v1/reset_password", user, {
        headers: this.headers,
      })
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => console.error(error)
      );
  }

  //---------------INSTITUTION APIS-----------------

  getInstitutions() {
    return this.http
      .get(this.baseUrl + "/institution/api/v1/get_institutions", {
        headers: this.headers,
      })
      .pipe(map((response) => response));
  }

  addInstitution(data) {
    console.log(data);
    return this.http
      .post(this.baseUrl + "/institution/api/v1/create_institution", data, {
        headers: this.headers,
      })
      .pipe(map((response) => response))
  }

  editInstitution(data) {
    console.log(data);
    return this.http
      .post(this.baseUrl + "/institution/api/v1/update_institution", data, {
        headers: this.headers,
      })
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
      .post(this.baseUrl + "/institution/api/v1/change_status", data, {
        headers: this.headers,
      })
      .pipe(map((response) => response))
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => console.error(error)
      );
  }

  editUser(user) {
    return this.http
      .post(this.baseUrl + "/user/api/v1/update_user", user, {
        headers: this.headers,
      })
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => console.error(error)
      );
  }
}
