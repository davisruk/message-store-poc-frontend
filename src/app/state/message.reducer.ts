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
    }))
)