import { createAction, props } from "@ngrx/store";
import { PaginatedMessageSummary } from "./state";
import { PageEvent } from "@angular/material/paginator";

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

export const paginatorUpdate = createAction (
    '[Message List] Paginator Update',
    props<{ update: PageEvent }>()
);