import { createReducer, on } from "@ngrx/store";
import { initialMessageState } from "./state";
import * as MessageActions from './message.actions';

export const messageReducer = createReducer(
    initialMessageState,
    on(MessageActions.loadMessageSummaries, (state) => ({
        ...state,
        loading:true,
        error:null
    })),
    on(MessageActions.loadMessageSummariesSuccess, (state, { paginatedMessages }) => ({
        ...state,
        paginatedMessages: paginatedMessages,
        loading: false,
        error: null
    })),
    on(MessageActions.loadMessageSummariesFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: error
    })),
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
    }))
)