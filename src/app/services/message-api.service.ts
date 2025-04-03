import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Message, PaginatedMessageSummary } from "../state/state";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class MessageApiService {
  
  private http = inject(HttpClient);

  getMessage(id: string): Observable<Message> {
    return this.http.get<Message>(`http://localhost:8080/api/messages/${id}`);
  }

  searchMessages(query: string, includePayload: boolean, pageNumber: number, size: number): Observable<PaginatedMessageSummary> {
    const params = new HttpParams()
      .set('query', query)
      .set('includePayload', includePayload? 'true' : 'false')
      .set('page', pageNumber)
      .set('size', size);
    return this.http.get<PaginatedMessageSummary>('http://localhost:8080/api/messages/search', { params });
  }
    
}