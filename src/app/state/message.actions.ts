import { createAction, props } from "@ngrx/store";
import { Message } from "./state";

export const loadMessages = createAction ('[Message] Load Messages');
export const loadMessagesSuccess = createAction (
    '[Message] Load Messages Success',
    props<{ messages: Message[] }>()
);

export const loadMessagesFailure = createAction (
    '[Message] Load Messages Failure',
    props<{ error: string }>()
);
