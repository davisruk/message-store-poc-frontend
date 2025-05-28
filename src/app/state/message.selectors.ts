import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MessageState, PaginatedMessageSummary } from './state';
import { ColumnField } from './column-fields';

// Select the entire feature state
export const selectMessageState = createFeatureSelector<MessageState>('messageState');

// Select individual properties from the feature state
export const selectPaginatedMessageSummaries = createSelector(
  selectMessageState,
  (state: MessageState) => state.paginatedMessages
);

export const selectMessageSummaries = createSelector(
  selectPaginatedMessageSummaries,
  (state: PaginatedMessageSummary | null) => state ? state.content : []
);

export const selectPageNumber = createSelector(
  selectPaginatedMessageSummaries,
  (state: PaginatedMessageSummary | null) => state ? state.pageNumber : 0
);

export const selectPageSize = createSelector(
  selectPaginatedMessageSummaries,
  (state: PaginatedMessageSummary | null) => state ? state.pageSize : 0
);

export const selectLoading = createSelector(
  selectMessageState,
  (state: MessageState) => state.loading
);

export const selectError = createSelector(
  selectMessageState,
  (state: MessageState) => state.error
);

export const selectSelectedMessages = createSelector(
  selectMessageState,
  state => state.selectedMessages
);

export const selectQuery = createSelector(
  selectMessageState,
  state => state.query
);

export const selectIncludePayload = createSelector(
  selectMessageState,
  state => state.includePayload
);

export const selectColumnSearch = createSelector(
  selectMessageState,
  state => state.columnSearch
);

export const selectMessageById = (id: string) => createSelector(
  selectSelectedMessages,
  msgs => msgs.find(m => m.id === id) || null
);

export const selectSortDescriptors = createSelector(
  selectColumnSearch,
  state => Object.entries(state)
    .map(([field,s]) => ({ field: field as ColumnField, ...s}))
    .filter(s => s.sortDirection != null)
    .sort((a, b) => (a.sortOrder! - b.sortOrder!))
    .map(s => ({ field: s.field, sortDirection: s.sortDirection! }))
  );

