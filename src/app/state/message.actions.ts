import { createAction, props } from "@ngrx/store";
import { Message, PaginatedMessageSummary } from "./state";
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

export const loadMessage = createAction (
    '[Message] Load Message',
    props<{ id: string }>()
);

export const loadMessageSuccess = createAction (
    '[Message] Load Message Success',
    props<{ message: Message }>()
);

export const loadMessageFailure = createAction (
    '[Message] Load Message Failure',
    props<{ error: string }>()
);
