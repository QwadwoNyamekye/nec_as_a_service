import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { HttpHeaders } from "@angular/common/http";
import { NbAuthService, NbAuthJWTToken } from "@nebular/auth";
import { CompatClient, Stomp } from "@stomp/stompjs";
import * as SockJS from "sockjs-client";
import { NbToastrService } from "@nebular/theme";
import { environment } from "../../../environments/environment.prod";
import { Subject } from "rxjs/Subject";

@Injectable({ providedIn: "root" })
export class NecService {
  user: any;
  websocket = environment.websocket;
  baseUrl = environment.baseUrl;
  bankUrl = environment.bankUrl;
  reportingUrl = environment.reportingUrl;
  data: any;
  headers: any;
  public stompClient;
  private compInstance = new Subject<any>();
  comp$ = this.compInstance.asObservable();

  constructor(
    private http: HttpClient,
    private authService: NbAuthService,
    private toastrService: NbToastrService
  ) {
    this.initializeVars();
    this.initializeWebSocketConnection();
  }

  initializeVars() {
    console.log(">>>>>>>>>>>>>>>>>>>>>>");
    console.log(sessionStorage.getItem("token"));
    this.headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + sessionStorage.getItem("token")
    );
    this.user = JSON.parse(sessionStorage.getItem("user")); // here we receive a payload from the token and assigns it to our `user` variable
    console.log(this.user);
  }

  websocketSuccessCallback() {
    this.stompClient.subscribe("/realtime/alert", (message) => {
      console.log("WEBSOCKET MESSAGE");
      console.log(message);
      var websocketdata = message.body.split(":");
      var websocketMessage = websocketdata[0];
      var websocketUser = websocketdata[1];
      console.log(this.user);
      if (websocketMessage != "" && websocketUser == this.user.id) {
        this.toastrService.success(websocketMessage, "Bulk File Processing", {
          duration: 8000,
          destroyByClick: true,
          duplicatesBehaviour: "previous",
          preventDuplicates: true,
        });
      }
    });
  }

  websocketFailureCallback(error) {
    console.log("STOMP: " + error);
    setTimeout(this.initializeWebSocketConnection, 10000);
    console.log("STOMP: Reconecting in 10 seconds");
  }

  initializeWebSocketConnection() {
    const serverUrl = this.websocket;
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);

    const that = this;
    console.log("STOMP CLIENT");
    console.log(this.stompClient);

    this.stompClient.connect({}, function (frame) {
      console.log("STOMP CLIENT");
      console.log(that.stompClient);
      that.stompClient.subscribe("/realtime/alert", (message) => {
        console.log("NEW WEBSOCKET CONNECTION");
        console.log(message);
        var websocketdata = message.body.split(":");
        console.log(websocketdata);
        console.log(websocketdata[1]);
        console.log(websocketdata[2]);
        console.log(that.user.id);
        console.log(typeof that.user.id);
        console.log(
          [websocketdata[1], websocketdata[2]].includes(that.user.id)
        );
        var websocketMessage = websocketdata[0];
        console.log(that.user);
        if (
          websocketMessage != "" &&
          [websocketdata[1], websocketdata[2]].includes(String(that.user.id))
        ) {
          that.toastrService.success(websocketMessage, "Bulk File Processing", {
            duration: 8000,
            destroyByClick: true,
            duplicatesBehaviour: "previous",
            preventDuplicates: true,
          });
          that.compInstance.next();
        }
      });
    });
  }

  resetPassword(user) {
    console.log("EEEEEEEEEEEEEEEEEEEEEE");
    console.log(user);
    return this.http
      .post(this.baseUrl + "/user/api/v1/reset_password", user, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  changePassword(user) {
    console.log("EEEEEEEEEEEEEEEEEEEEEE");
    console.log(user);
    return this.http
      .post(this.baseUrl + "/user/api/v1/change_password", user, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  //-------------BULK--------------

  getFileRecords(batch_id) {
    return this.http
      .get(
        this.baseUrl +
          "/batch_details/api/v1/get_branch_details_by_batch_id/" +
          batch_id,
        {
          headers: this.headers,
        }
      )
      .pipe((response) => response);
  }

  getUploads(email) {
    return this.http
      .get(this.baseUrl + "/upload/api/v1/get_uploads/" + email, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  submitForProcessing(batchId, submittedBy) {
    return this.http
      .get(
        this.baseUrl +
          `/upload/api/v1/submit_upload_for_processing/${batchId}/${submittedBy}`,
        { headers: this.headers }
      )
      .pipe((response) => response);
  }

  rejectUploadedFile(batchId, submittedBy) {
    return this.http
      .get(
        this.baseUrl + `/upload/api/v1/reject_upload/${batchId}/${submittedBy}`,
        { headers: this.headers }
      )
      .pipe((response) => response);
  }

  declineUploadedFile(batchId, submittedBy) {
    return this.http
      .get(
        this.baseUrl +
          `/upload/api/v1/decline_upload/${batchId}/${submittedBy}`,
        { headers: this.headers }
      )
      .pipe((response) => response);
  }

  submitForAuthorization(batchId, submittedBy) {
    return this.http
      .get(
        this.baseUrl +
          `/upload/api/v1/submit_upload_for_authorization/${batchId}/${submittedBy}`,
        { headers: this.headers }
      )
      .pipe((response) => response);
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
      .pipe((response) => response);
  }

  //-------------------BANKS------------------
  getBanks() {
    return this.http
      .get(this.bankUrl + "/blaster/api/v1/banks", { headers: this.headers })
      .pipe((response) => response);
  }

  getUploadStatus() {
    return this.http
      .get(this.baseUrl + "/upload/api/v1/get_uploads_status", {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  getSingleNECList(email) {
    console.log(">>>>>>>>>>>>");
    console.log(this.headers);
    return this.http
      .get(this.baseUrl + "/single/api/v1/nec_list/" + email, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  makeSingleNECRequest(data) {
    console.log(data);
    return this.http
      .post(this.baseUrl + "/single/api/v1/nec", data, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  //-------------- USERS APIS------------------

  getUsers(email) {
    return this.http
      .get(this.baseUrl + "/user/api/v1/get_users/" + email, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  getRoles() {
    return this.http
      .get(this.baseUrl + "/user/api/v1/get_roles", { headers: this.headers })
      .pipe((response) => response);
  }

  postUsers(user) {
    return this.http
      .post(this.baseUrl + "/user/api/v1/create_user", user, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  unlockUser(user) {
    return this.http
      .post(this.baseUrl + "/user/api/v1/unlock_user", user, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  changeUserStatus(user) {
    return this.http
      .post(this.baseUrl + "/user/api/v1/change_status", user, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  resetUserPassword(user) {
    return this.http
      .post(this.baseUrl + "/user/api/v1/reset_password", user, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  //---------------INSTITUTION APIS-----------------

  getInstitutions() {
    return this.http
      .get(this.baseUrl + "/institution/api/v1/get_institutions", {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  addInstitution(data) {
    console.log(data);
    return this.http
      .post(this.baseUrl + "/institution/api/v1/create_institution", data, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  editInstitution(data) {
    console.log(data);
    return this.http
      .post(this.baseUrl + "/institution/api/v1/update_institution", data, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  changeInstitutionStatus(data) {
    console.log(data);
    return this.http
      .post(this.baseUrl + "/institution/api/v1/change_status", data, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  editUser(user) {
    return this.http
      .post(this.baseUrl + "/user/api/v1/update_user", user, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  ///////////////////REPORTS API//////////////
  getNecReport(data) {
    return this.http
      .post(this.reportingUrl + "/nec-report/api/v1/get_nec_report", data, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  getUploadReport(data) {
    return this.http
      .post(this.reportingUrl + "/upload/api/v1/get_uploads_report", data, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }
}
