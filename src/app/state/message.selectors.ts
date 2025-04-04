import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MessageState, PaginatedMessageSummary } from './state';

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

