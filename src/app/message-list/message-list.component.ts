import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Observable, take } from 'rxjs';
import { Message, MessageSummary, PaginatedMessageSummary } from '../state/state';
import { Store } from '@ngrx/store';
import { loadMessage, paginatorUpdate, searchMessages } from '../state/message.actions';
import { CommonModule } from '@angular/common';
import { selectError, selectLoading, selectMessageSummaries, selectPaginatedMessageSummaries, selectSelectedMessages } from '../state/message.selectors';
import { Component, DestroyRef, inject, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { safeSubscribe } from '../utils/rx-helpers';
import { ColumnsSearchInputComponent } from '../columns-search-input/columns-search-input.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
@Component({
  selector: 'app-message-list',
  imports: [CommonModule, MatPaginatorModule, MatIconModule, MatTableModule, ColumnsSearchInputComponent],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent {

  private store = inject(Store);
  private destroyRef = inject(DestroyRef);
  private breakpointObserver = inject(BreakpointObserver);

  pagination$: Observable<PaginatedMessageSummary | null>;
  messageSummaries$: Observable<MessageSummary[] | null>;
  selectedMessages$: Observable<Message[]>
  dataSource = new MatTableDataSource<MessageSummary>();
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChildren(ColumnsSearchInputComponent) columnSearchInputs!: QueryList<ColumnsSearchInputComponent>;
  
  displayedColumns: string[] = ['id', 'source', 'destination', 'correlation', 'tech'];
 
  selectedRow: MessageSummary | null = null;
  
  constructor() {
    this.pagination$ = this.store.select(selectPaginatedMessageSummaries);
    this.messageSummaries$ = this.store.select(selectMessageSummaries);
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
    this.selectedMessages$ = this.store.select(selectSelectedMessages);
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

    safeSubscribe(
      this.breakpointObserver.observe(Breakpoints.Tablet), this.destroyRef,
      result => {
        if (result.matches) {
          this.displayedColumns = ['id', 'source', 'destination', 'correlation'];
          this.clearField('messageRenderTechnology');
        } else {
          this.displayedColumns = ['id', 'source', 'destination', 'correlation', 'tech'];
        }
      }
    );

    safeSubscribe(this.breakpointObserver.observe([Breakpoints.Handset,
      Breakpoints.Tablet,
      Breakpoints.Web]), this.destroyRef,
      result => {
        const matchingBreakpoints = Object.entries(result.breakpoints)
          .filter(([_, value]) => value)
          .map(([key]) => key);
          this.displayedColumns = this.getColumnsForBreakpoint(matchingBreakpoints);
          if (result.breakpoints[Breakpoints.Handset]) {
            this.clearField('destinationAddress');
            this.clearField('messageRenderTechnology');
          } else if (result.breakpoints[Breakpoints.Tablet]) {
          this.clearField('messageRenderTechnology');
        }
      }
   );    
  }

  getColumnsForBreakpoint(bp: string[]): string[] {
    if (bp.includes(Breakpoints.Handset)) {
      return ['id', 'source', 'correlation'];
    } else if (bp.includes(Breakpoints.Tablet)) {
      return ['id', 'source', 'destination', 'correlation'];
    } else {
      return ['id', 'source', 'destination', 'correlation', 'tech'];
    }
  }
  
  clearField(field: string) {
    const input = this.columnSearchInputs.find(input => input.field === field)
    input?.clear();
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
    this.store.dispatch(loadMessage({ id: row.id }));
  }

  isSelected(row: MessageSummary, selected: Message[]): boolean {
    return selected.some((message) => message.id === row.id);
  }
}
