import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CompatClient, Stomp } from "@stomp/stompjs";
// import * as SockJS from "sockjs-client";
import { Router } from "@angular/router";
import {
  NbGlobalPhysicalPosition,
  NbToastRef,
  NbToastrService,
} from "@nebular/theme";
import { Subject } from "rxjs/Subject";
import SockJS from "sockjs-client";
import { environment } from "../../../environments/environment.prod";

@Injectable({ providedIn: "root" })
export class NecService {
  user: any;
  baseUrl = environment.baseUrl;
  bankUrl = environment.bankUrl;
  reportingUrl = environment.reportingUrl;
  data: any;
  headers: any;
  public stompClient: CompatClient;
  private compInstance = new Subject<any>();
  comp$ = this.compInstance.asObservable();
  errorToastr: NbToastRef;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastrService: NbToastrService
  ) {
    this.initializeVars();
    this.initializeWebSocketConnection(this.errorToastr);

    // window.addEventListener('online', () => console.log('Became online'));
    window.addEventListener("offline", () => {
      if (!this.errorToastr && this.user) {
        // if there isn't a 'Connection Lost' toaster already and user is logged in
        this.errorToastr = this.toastrService.danger(
          "Connection Lost",
          "Connection",
          {
            position: NbGlobalPhysicalPosition.BOTTOM_LEFT,
            preventDuplicates: true,
            destroyByClick: true,
            duration: 0,
          }
        );
        setTimeout(() => {
          this.initializeWebSocketConnection(this.errorToastr);
        }, 5000);
      }
    });
  }

  initializeVars() {
    this.headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + sessionStorage.getItem("token")
    );
    this.user = JSON.parse(sessionStorage.getItem("user")); // here we receive a payload from the token and assigns it to our `user` variable
  }

  initializeWebSocketConnection(errorToastr: NbToastRef) {
    var websocket = environment.websocket;
    const serverUrl = websocket;
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(() => {
      return ws;
    });

    // this.stompClient.reconnect_delay = 1000;
    // this.stompClient.reconnectDelay = 10000;

    this.stompClient.connect(
      {},
      (frame) => {
        if (errorToastr) {
          errorToastr.close();
          var value = this.toastrService.success(
            "Connection Success",
            "Connection",
            {
              position: NbGlobalPhysicalPosition.BOTTOM_LEFT,
              preventDuplicates: true,
              destroyByClick: true,
              duration: 10000,
            }
          );

          // show connection success toaster and redirection text in 5 seconds
          var time = 5;
          var intervalId = setInterval(function () {
            value.toastInstance.toast.message = "Reloading in  : " + time;
            if (time == 0) {
              window.location.reload();
              window.clearInterval(intervalId);
            }
            time--;
          }, 1000);
        }
        this.stompClient.subscribe("/realtime/alert", (message) => {
          var websocketdata = message.body.split(":");
          var websocketMessage = websocketdata[0];
          if (
            websocketMessage != "" &&
            [websocketdata[1], websocketdata[2]].includes(String(this.user.id))
          ) {
            this.toastrService.success(
              websocketMessage,
              "Bulk File Processing",
              {
                duration: 8000,
                destroyByClick: true,
                duplicatesBehaviour: "previous",
                preventDuplicates: true,
              }
            );
            this.compInstance.next();
          }
        });
      },
      (error) => {
        if (!errorToastr && this.user) {
          // if there isn't a 'Connection Lost' toaster already and user is logged in
          errorToastr = this.toastrService.danger(
            "Connection Lost",
            "Connection",
            {
              position: NbGlobalPhysicalPosition.BOTTOM_LEFT,
              preventDuplicates: true,
              destroyByClick: true,
              duration: 0,
            }
          );
        }
        setTimeout(() => {
          this.initializeWebSocketConnection(errorToastr);
        }, 5000);
      },
      (frame) => {
        if (!errorToastr && this.user) {
          // if there isn't a 'Connection Lost' toaster already and user is logged in
          errorToastr = this.toastrService.danger(
            "Connection Lost",
            "Connection",
            {
              position: NbGlobalPhysicalPosition.BOTTOM_LEFT,
              preventDuplicates: true,
              destroyByClick: true,
              duration: 0,
            }
          );
        }
        setTimeout(() => {
          this.initializeWebSocketConnection(errorToastr);
        }, 5000);
      }
    );
  }

  checkJWTValid() {
    const jwtPayload = JSON.parse(
      window.atob(sessionStorage.getItem("token").split(".")[1])
    );
    var expTime = jwtPayload.exp * 1000;
    if (Date.now() >= expTime) {
      var toaster = this.toastrService.danger(
        "Session Expired: Please Login Again",
        "Session",
        {
          position: NbGlobalPhysicalPosition.BOTTOM_LEFT,
          preventDuplicates: true,
          destroyByClick: true,
          duration: 0,
        }
      );
      var time = 5;
      var intervalId = setInterval(
        (router) => {
          toaster.toastInstance.toast.message = "Redirecting in  : " + time;
          if (time == 0) {
            router.navigate(["auth/login"]);
            window.clearInterval(intervalId);
          }
          time--;
        },
        1000,
        this.router
      );
    }
  }

  resetPassword(user) {
    return this.http
      .post(this.baseUrl + "/user/api/v1/reset_password", user, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  changePassword(user) {
    return this.http
      .post(this.baseUrl + "/user/api/v1/change_password", user, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  //-------------BULK--------------

  getFileRecords(batch_id) {
    this.checkJWTValid();
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
    this.checkJWTValid();
    return this.http
      .get(this.baseUrl + "/upload/api/v1/get_uploads/" + email, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  getUploadsByStatus(status) {
    this.checkJWTValid();
    return this.http
      .get(
        this.reportingUrl +
          "/upload/api/v1/get_uploads_by_status/" +
          status +
          "/" +
          this.user.email,
        {
          headers: this.headers,
        }
      )
      .pipe((response) => response);
  }

  getUploadStatusInstitution(status, email, institution) {
    this.checkJWTValid();
    return this.http
      .get(
        this.baseUrl +
          "/upload/api/v1/get_uploads_by_status_institution/" +
          status +
          "/" +
          email +
          "/" +
          institution,
        {
          headers: this.headers,
        }
      )
      .pipe((response) => response);
  }

  getUploadStatusBank(status, email, bank) {
    this.checkJWTValid();
    return this.http
      .get(
        this.baseUrl +
          "/upload/api/v1/get_uploads_by_status_bank/" +
          status +
          "/" +
          email +
          "/" +
          bank,
        {
          headers: this.headers,
        }
      )
      .pipe((response) => response);
  }

  getUploadByStatus(status, email) {
    this.checkJWTValid();
    return this.http
      .get(
        this.baseUrl +
          "/upload/api/v1/get_uploads_by_status_bank/" +
          status +
          "/" +
          email,
        {
          headers: this.headers,
        }
      )
      .pipe((response) => response);
  }

  submitForProcessing(batchId, submittedBy) {
    this.checkJWTValid();
    return this.http
      .get(
        this.baseUrl +
          `/upload/api/v1/submit_upload_for_processing/${batchId}/${submittedBy}`,
        { headers: this.headers }
      )
      .pipe((response) => response);
  }

  rejectUploadedFile(batchId, submittedBy) {
    this.checkJWTValid();
    return this.http
      .get(
        this.baseUrl + `/upload/api/v1/reject_upload/${batchId}/${submittedBy}`,
        { headers: this.headers }
      )
      .pipe((response) => response);
  }

  declineUploadedFile(batchId, submittedBy) {
    this.checkJWTValid();
    return this.http
      .get(
        this.baseUrl +
          `/upload/api/v1/decline_upload/${batchId}/${submittedBy}`,
        { headers: this.headers }
      )
      .pipe((response) => response);
  }

  submitForAuthorization(batchId, submittedBy) {
    this.checkJWTValid();
    return this.http
      .get(
        this.baseUrl +
          `/upload/api/v1/submit_upload_for_authorization/${batchId}/${submittedBy}`,
        { headers: this.headers }
      )
      .pipe((response) => response);
  }

  uploadFile(file, description, createdBy, count) {
    this.checkJWTValid();
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
    this.checkJWTValid();
    return this.http
      .get(this.bankUrl + "/blaster/api/v1/banks", { headers: this.headers })
      .pipe((response) => response);
  }

  getUploadStatus() {
    this.checkJWTValid();
    return this.http
      .get(this.baseUrl + "/upload/api/v1/get_uploads_status", {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  getSingleNECList() {
    this.checkJWTValid();
    return this.http
      .get(this.baseUrl + "/single/api/v1/nec_list/" + this.user.email, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  makeSingleNECRequest(data) {
    this.checkJWTValid();
    return this.http
      .post(this.baseUrl + "/single/api/v1/nec", data, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  //-------------- USERS APIS------------------

  getUsers(email) {
    this.checkJWTValid();
    return this.http
      .get(this.baseUrl + "/user/api/v1/get_users/" + email, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  getUsersByInstitution(email, institutionCode, type) {
    this.checkJWTValid();
    return this.http
      .get(
        this.baseUrl +
          "/user/api/v1/get_users/" +
          email +
          "/" +
          institutionCode +
          "/" +
          type,
        {
          headers: this.headers,
        }
      )
      .pipe((response) => response);
  }

  getRoles() {
    this.checkJWTValid();
    return this.http
      .get(this.baseUrl + "/user/api/v1/get_roles", { headers: this.headers })
      .pipe((response) => response);
  }

  postUsers(user) {
    this.checkJWTValid();
    return this.http
      .post(this.baseUrl + "/user/api/v1/create_user", user, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  unlockUser(user) {
    this.checkJWTValid();
    return this.http
      .post(this.baseUrl + "/user/api/v1/unlock_user", user, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  changeUserStatus(user) {
    this.checkJWTValid();
    return this.http
      .post(this.baseUrl + "/user/api/v1/change_status", user, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  resetUserPassword(user) {
    this.checkJWTValid();
    return this.http
      .post(this.baseUrl + "/user/api/v1/reset_password", user, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  deleteUser(user) {
    this.checkJWTValid();
    return this.http
      .post(this.baseUrl + "/user/api/v1/delete_user", user, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  //---------------INSTITUTION APIS-----------------

  getInstitutions() {
    this.checkJWTValid();
    return this.http
      .get(this.baseUrl + "/institution/api/v1/get_institutions", {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  getInstitutionsByBank(bankId) {
    this.checkJWTValid();
    return this.http
      .get(
        this.baseUrl +
          "/institution/api/v1/get_institutions_by_bank" +
          "/" +
          bankId,
        {
          headers: this.headers,
        }
      )
      .pipe((response) => response);
  }

  addInstitution(data) {
    this.checkJWTValid();
    return this.http
      .post(this.baseUrl + "/institution/api/v1/create_institution", data, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  editInstitution(data) {
    this.checkJWTValid();
    return this.http
      .post(this.baseUrl + "/institution/api/v1/update_institution", data, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  changeInstitutionStatus(data) {
    this.checkJWTValid();
    return this.http
      .post(this.baseUrl + "/institution/api/v1/change_status", data, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  editUser(user) {
    this.checkJWTValid();
    return this.http
      .post(this.baseUrl + "/user/api/v1/update_user", user, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  ///////////////////REPORTS API//////////////
  getAuditLogs() {
    this.checkJWTValid();
    return this.http
      .get(this.baseUrl + "/api/v1/audit/get_all_audit_logs", {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  getFeeLogs(dateRange) {
    this.checkJWTValid();
    return this.http
      .post(
        this.reportingUrl + "/nec-report/api/v1/nec_fee_report",
        dateRange,
        {
          headers: this.headers,
        }
      )
      .pipe((response) => response);
  }

  getNecReport(data) {
    this.checkJWTValid();
    return this.http
      .post(this.reportingUrl + "/nec-report/api/v1/get_nec_report", data, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }

  getUploadReport(data) {
    this.checkJWTValid();
    return this.http
      .post(this.reportingUrl + "/upload/api/v1/get_uploads_report", data, {
        headers: this.headers,
      })
      .pipe((response) => response);
  }
}
