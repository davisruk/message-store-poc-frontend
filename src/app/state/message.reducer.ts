import { createReducer, on } from "@ngrx/store";
import { initialMessageState, Message } from "./state";
import * as MessageActions from './message.actions';

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
    on(MessageActions.updateColumnSearch, (state, { field, value }) => ({
        ...state,
        columnSearch: {
            ...state.columnSearch,
            [field]: value
        }
    })),
    on(MessageActions.clearColumnSearch, (state) => ({
        ...state,
        columnSearch: {}
    }))
);
