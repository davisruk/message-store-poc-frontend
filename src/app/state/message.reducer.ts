import { createReducer, on } from "@ngrx/store";
import { ColumnState, initialMessageState, Message, SortDirection } from "./state";
import * as MessageActions from './message.actions';
import { ColumnField } from "./column-fields";
import { toggleSort } from "./message.actions";

export const messageReducer = createReducer(
    initialMessageState,

    on(MessageActions.paginatorUpdate, (state, { update }) => ({
        ...state,
        paginatedMessages: {
            ...state.paginatedMessages,
            content: state.paginatedMessages?.content || [],
            totalPages: update.length,
            pageNumber: update.pageIndex,
            pageSize: update.pageSize,
            totalElements: state.paginatedMessages?.totalElements || 0           
        }
    })),
    on(MessageActions.loadMessage, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(MessageActions.loadMessageSuccess, (state, { message }) => ({
        ...state,
        loading: false,
        selectedMessage: message,
        error: null
    })),
    on(MessageActions.loadMessageFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: error
    })),
    on(MessageActions.searchMessagesSuccess, (state, { paginatedMessages }) => ({
        ...state,
        paginatedMessages: paginatedMessages,
        selectedMessage: null,
        loading: false,
        error: null
    })),
    on(MessageActions.updateSearchCriteria, (state, { query, includePayload }) => ({
        ...state,
        query: query,
        includePayload: includePayload,
        paginatedMessages: {
            ...state.paginatedMessages,
            content: state.paginatedMessages?.content || [], // Preserve existing content or default to an empty array
            pageNumber: 0,
            totalElements: state.paginatedMessages?.totalElements || 0, // Default to 0 if undefined
            totalPages: state.paginatedMessages?.totalPages || 0, // Default to 0 if undefined
            pageSize: state.paginatedMessages?.pageSize || 10 // Default to 10 if undefined
        }
        })),
    on(MessageActions.searchMessagesFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: error
    })),
    on(MessageActions.addSelectedMessage, (state, { message }) => {
        const alreadySelected = state.selectedMessages?.find(m => m.id === message.id);
        let updated: Message[];
        if (alreadySelected) {
            updated = state.selectedMessages.filter(m => m.id !== message.id);
        } else if (state.selectedMessages.length < 2) {
            updated = [...state.selectedMessages, message];
        } else {
            updated = [state.selectedMessages[0], message];
        }
        return {
            ...state,
            selectedMessages: updated
        };
    }),
    on(MessageActions.updateColumnSearch, (state, { field, filter }) => ({
        ...state,
        columnSearch: {
            ...state.columnSearch,
            [field]: {
                ...state.columnSearch[field],
                filter,
            }
        },
        paginatedMessages: { ...state.paginatedMessages!, pageNumber: 0 }
    })),
    on(toggleSort, (state, { field }) => {
        const colMap = { ...state.columnSearch };
        const current = colMap[field];
      
        // 1) Gather sorted fields by their order
        const orderedFields = Object.entries(colMap)
          .filter(([, cs]) => cs.sortOrder != null)
          .sort(([, a], [, b]) => (a.sortOrder! - b.sortOrder!))
          .map(([f]) => f as ColumnField);
      
        let removedOrder: number|undefined;
        if (!current.sortDirection) {
          // not sorted before → add ascending at end
          colMap[field] = {
            ...current,
            sortDirection: 'asc',
            sortOrder: orderedFields.length
          };
        } else if (current.sortDirection === 'asc') {
          // flip to descending, keep same order slot
          colMap[field] = {
            ...current,
            sortDirection: 'desc'
          };
        } else {
          // was descending → remove from map
          removedOrder = current.sortOrder;
          colMap[field] = {
            ...current,
            sortDirection: undefined,
            sortOrder: undefined
          };
        }
      
        // 2) If we removed one, shift down all greater orders
        if (removedOrder != null) {
          Object.entries(colMap).forEach(([f, cs]) => {
            if (cs.sortOrder != null && cs.sortOrder > removedOrder!) {
              colMap[f] = {
                ...cs,
                sortOrder: cs.sortOrder - 1
            }
          }});
        }
      
        return {
          ...state,
          columnSearch: colMap,
          paginatedMessages: {
            ...state.paginatedMessages!,
            pageNumber: 0
          }
        };
    }),
    on(MessageActions.clearColumnSearch, (state) => ({
        ...state,
        columnSearch: initialMessageState.columnSearch
    })),
    on(MessageActions.formatMessageSuccess, (state, {id, formattedMessage}) => {
      const updated = state.selectedMessages.map((message) => 
        message.id === id ? { ...message, formattedPayload: formattedMessage } : message
      );
      return {
        ...state,
        selectedMessages: updated
      };
    }),
);
