import { createAction, props } from "@ngrx/store";
import { Message, PaginatedMessageSummary } from "./state";
import { PageEvent } from "@angular/material/paginator";

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

export const searchMessages = createAction (
    '[Search] Search Messages',
);

export const searchMessagesSuccess = createAction (
    '[Search] Search Messages Success',
    props<{ paginatedMessages: PaginatedMessageSummary }>()
);

export const searchMessagesFailure = createAction (
    '[Search] Search Messages Failure',
    props<{ error: string }>()
);

export const updateSearchCriteria = createAction (
    '[Search] Update Search Criteria',
    props<{ query: string, includePayload: boolean }>()
);

export const addSelectedMessage = createAction (
    '[Message] Add Selected Message',
    props<{ message: Message }>()
);