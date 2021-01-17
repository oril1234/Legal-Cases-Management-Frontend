import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpEvent
} from "@angular/common/http";
import { map, tap, last } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";
import { environment } from "../../environments/environment";

let BASE_URL:string = "http://localhost:9090";


if (environment.production) {
  // Amazon AWS Backend
  BASE_URL = "http://oglegal.us-east-1.elasticbeanstalk.com"
}

@Injectable({
  providedIn: "root"
})
export class UploaderService {
  public progressSource = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {} 

  upload(file: File) {
    let formData = new FormData();
    formData.append("File", file);

    const req = new HttpRequest(
      "POST",
      BASE_URL + "/api/v1/import/upload-file",
      formData,
      {
        reportProgress: true
      }
    );

    return this.http.request(req).pipe(
      map(event => this.getEventMessage(event, file)),
      tap((envelope: any) => this.processProgress(envelope)),
      last()
    );
  }

  confirmupload(file_path: string) {
    let formData = new FormData();
    formData.append("File", file_path);

    const req = new HttpRequest(
      "POST",
      BASE_URL + "/api/v1/import/confirm-upload",
      formData,
      {
        reportProgress: true
      }
    );

    return this.http.request(req).pipe(
      map(event => this.getEventMessage(event, file_path)),
      tap((envelope: any) => this.processProgress(envelope)),
      last()
    );
    
  }

  processProgress(envelope: any): void {
    if (typeof envelope === "number") {
      this.progressSource.next(envelope);
    }
  }

  private getEventMessage(event: HttpEvent<any>, file: any) {
    switch (event.type) { 
      case HttpEventType.Sent:
        return `Uploading file`;
      case HttpEventType.UploadProgress:
        return Math.round((100 * event.loaded) / event.total);
      case HttpEventType.Response:
        return event.body;
      default:
        return `File "${file}" surprising upload event: ${event.type}.`;
    }
  }

}
