import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, catchError, timeout } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class BulkService {
  constructor(private http: HttpClient) {}

  baseUrl = "http://172.27.21.210:8089";

  getUploads() {
    return this.http
      .get(this.baseUrl + "/upload/api/v1/get_uploads")
      .pipe(map((response) => response));
  }

  submitForProcessing(batchId, submittedBy) {
    return this.http
      .get(
        this.baseUrl +
          `/upload/api/v1/submit_upload_for_processing/${batchId}/${submittedBy}`
      )
      .pipe(
        map((response) => response)
      );
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
        file
      )
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => console.error(error)
      );
  }
}
