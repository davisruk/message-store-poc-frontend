import { Component } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { Observable, take } from 'rxjs';
import { MessageSummary, PaginatedMessageSummary } from '../state/state';
import { Store } from '@ngrx/store';
import { loadMessageSummaries, paginatorUpdate } from '../state/message.actions';
import { CommonModule } from '@angular/common';
import { selectError, selectLoading, selectMessageSummaries, selectPaginatedMessageSummaries } from '../state/message.selectors';

@Component({
  selector: 'app-message-list',
  imports: [CommonModule, MatPaginatorModule, MatIconModule],
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
    this.pagination$.pipe(
      take(1)
    ).subscribe((pagination) => {
      if (pagination) {
        this.store.dispatch(loadMessageSummaries({ pageNumber: pagination.pageNumber, size: pagination.pageSize }));
      }
    });
  }

  page(event: PageEvent) {
    this.store.dispatch(paginatorUpdate({ update: event}));
    this.load();
    }
  }
