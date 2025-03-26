import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageSummary, PaginatedMessageSummary } from '../state/state';
import { Store } from '@ngrx/store';
import { loadMessageSummaries } from '../state/message.actions';
import { CommonModule } from '@angular/common';
import { selectError, selectLoading, selectMessageSummaries, selectPaginatedMessageSummaries } from '../state/message.selectors';

@Component({
  selector: 'app-message-list',
  imports: [CommonModule],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent {
  pagination$: Observable<PaginatedMessageSummary | null>;
  messageSummaries$: Observable<MessageSummary[] | null>;

  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private store: Store) {
    this.pagination$ = this.store.select(selectPaginatedMessageSummaries);
    this.messageSummaries$ = this.store.select(selectMessageSummaries);
    this.loading$ = this.store.select(selectLoading);
    this.error$ =this.store.select(selectError);
  }

  load() {
    this.store.dispatch(loadMessageSummaries({ pageNumber: 0, size: 10 }));
  }
}
