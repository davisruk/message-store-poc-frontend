import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { PaginatedMessageSummary } from "../state/state";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class MessageApiService {
  
  private http = inject(HttpClient);

  getMessageSummaries(page:number, size:number): Observable<PaginatedMessageSummary> {
    return this.http.get<PaginatedMessageSummary>(`http://localhost:8080/api/messages/summaries?page=${page}&size=${size}`);
  }
}