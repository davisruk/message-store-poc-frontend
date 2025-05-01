import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ColumnState, Message, PaginatedMessageSummary, SortDirection } from "../state/state";
import { Observable } from "rxjs";
import { ColumnField } from "../state/column-fields";

@Injectable({
  providedIn: "root"
})
export class MessageApiService {
  
  private http = inject(HttpClient);

  getMessage(id: string): Observable<Message> {
    return this.http.get<Message>(`http://localhost:9090/api/messages/${id}`);
  }

  searchMessages(query: string, includePayload: boolean, pageNumber: number, size: number, columnState: Record<ColumnField, ColumnState>): Observable<PaginatedMessageSummary> {
    let params = new HttpParams()
      .set('query', query)
      .set('includePayload', includePayload? 'true' : 'false')
      .set('page', pageNumber)
      .set('size', size);

      Object.entries(columnState)
        .filter(([_, state]) => !!state.sortDirection)
        .sort(([,a], [,b]) => (a.sortOrder! - b.sortOrder!))
        .forEach(([field, state]) => {
          params = params.append('sort', `${field}, ${state.sortDirection}`); // Append sort direction for each field
        });

      Object.entries(columnState).forEach(([field, state]) => {
        if (state.filter) {
          params = params.append(field, state.filter); // Append filter for each field
        }});
   
    return this.http.get<PaginatedMessageSummary>('http://localhost:9090/api/messages/loadMessageSummaries', { params });
  }
    
}