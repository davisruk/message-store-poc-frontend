import { createReducer, on } from "@ngrx/store";
import { initialMessageState } from "./state";
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
        loading: false,
        error: null
    })),
    on(MessageActions.updateSearchCriteria, (state, { query, includePayload }) => ({
        ...state,
        query: query,
        includePayload: includePayload
    })),
    
)