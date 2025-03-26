import { createAction, props } from "@ngrx/store";
import { PaginatedMessageSummary } from "./state";

export const loadMessageSummaries = createAction (
    '[Message List] Load Message Summaries',
    props<{ pageNumber: number, size: number }>()
);

export const loadMessageSummariesSuccess = createAction (
    '[Message] Load Message Summaries Success',
    props<{ paginatedMessages: PaginatedMessageSummary }>()
);

export const loadMessageSummariesFailure = createAction (
    '[Message] Load Message Summaries Failure',
    props<{ error: string }>()
);