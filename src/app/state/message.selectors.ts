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
  (state: PaginatedMessageSummary | null) => state ? state.content : null
);

export const selectLoading = createSelector(
  selectMessageState,
  (state: MessageState) => state.loading
);

export const selectError = createSelector(
  selectMessageState,
  (state: MessageState) => state.error
);