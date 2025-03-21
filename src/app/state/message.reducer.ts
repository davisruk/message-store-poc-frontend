import { createReducer, on } from "@ngrx/store";
import { initialMessageState } from "./state";
import * as MessageActions from './message.actions';

export const messageReducer = createReducer(
    initialMessageState,
    on(MessageActions.loadMessages, (state) => ({
        ...state,
        loading:true,
        error:null
    })),
    on(MessageActions.loadMessagesSuccess, (state, { messages }) => ({
        ...state,
        messages: messages,
        loading: false,
        error: null
    })),
    on(MessageActions.loadMessagesFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: error
    }))
)