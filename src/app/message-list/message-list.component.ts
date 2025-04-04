import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Observable, take } from 'rxjs';
import { MessageSummary, PaginatedMessageSummary } from '../state/state';
import { Store } from '@ngrx/store';
import { loadMessage, paginatorUpdate, searchMessages } from '../state/message.actions';
import { CommonModule } from '@angular/common';
import { selectError, selectLoading, selectMessageSummaries, selectPaginatedMessageSummaries } from '../state/message.selectors';
import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { safeSubscribe } from '../utils/rx-helpers';

@Component({
  selector: 'app-message-list',
  imports: [CommonModule, MatPaginatorModule, MatIconModule, MatTableModule],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent {

  private store = inject(Store);
  private destroyRef = inject(DestroyRef);

  pagination$: Observable<PaginatedMessageSummary | null>;
  messageSummaries$: Observable<MessageSummary[] | null>;
  dataSource = new MatTableDataSource<MessageSummary>();
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  displayedColumns: string[] = ['id', 'source', 'destination', 'correlation', 'tech'];
  selectedRow: MessageSummary | null = null;
  
  constructor() {
    this.pagination$ = this.store.select(selectPaginatedMessageSummaries);
    this.messageSummaries$ = this.store.select(selectMessageSummaries);
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
  }

  ngOnInit() {
  
    this.load();
    
    safeSubscribe(this.messageSummaries$, this.destroyRef, (messageSummaries) => {
      console.log('Setting dataSource.data to', messageSummaries);
      this.dataSource.data = messageSummaries ?? [];
    });
  }
  
  ngAfterViewInit() {
      // subscribe to the pagination$ observable and update the paginator
      // mat-paginator does not synchronize with the observable automatically
      // so we need to do it manually
      // need to put it here because the paginator is not available in ngOnInit
      safeSubscribe(this.pagination$, this.destroyRef, (pagination) => {
        if (pagination && this.paginator) {
          this.paginator.pageIndex = pagination.pageNumber;
          this.paginator.pageSize = pagination.pageSize;
          this.paginator.length = pagination.totalElements;
      }
    });
  }

  load() {
    this.pagination$.pipe(
      take(1)
    ).subscribe((pagination) => {
      if (pagination) {
        this.store.dispatch(searchMessages());
      }
    });
  }

  page(event: PageEvent) {
    this.store.dispatch(paginatorUpdate({ update: event}));
    this.load();
  }

  tableRowClicked(row: MessageSummary) {
    this.selectedRow = row;
    this.store.dispatch(loadMessage({ id: row.id }));
  }
}
