import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, catchError, of, switchMap, withLatestFrom } from "rxjs";
import { loadMessage, loadMessageSuccess, loadMessageFailure, searchMessages, searchMessagesSuccess, searchMessagesFailure, addSelectedMessage } from "./message.actions";
import { MessageApiService } from "../services/message-api.service";
import { Store } from "@ngrx/store";
import { selectColumnSearch, selectIncludePayload, selectPageNumber, selectPageSize, selectQuery, selectSortDescriptors } from "./message.selectors";

@Injectable()
export class MessageEffects {
    // use inject instead of constructor injection
    // ngRx DI sometimes calls the constructor before the
    // actions$ and other dependencies are available
    // alternatively, use a constructor to create the effects
    private actions$ = inject(Actions);
    private messageService = inject(MessageApiService);
    private store = inject(Store);
    
    loadMessage$ = createEffect(() => this.actions$.pipe(
        ofType(loadMessage),
        switchMap(({ id }) => this.messageService.getMessage(id).pipe(
            map(message => addSelectedMessage({ message })),
            catchError(error => of(loadMessageFailure({ error: error.message })))
        ))
    ));

    loadSearchMessages$ = createEffect(() => this.actions$.pipe(
        ofType(searchMessages),
        withLatestFrom(
            this.store.select(selectQuery),
            this.store.select(selectIncludePayload),
            this.store.select(selectPageNumber),
            this.store.select(selectPageSize),
            this.store.select(selectColumnSearch) 
        ),
        switchMap(([_, query, includePayload, pageNumber, pageSize, columnSearch]) => {
            return this.messageService.searchMessages(query, includePayload, pageNumber, pageSize, columnSearch).pipe(
                map(paginatedMessages => searchMessagesSuccess({ paginatedMessages })),
                catchError(error => of(searchMessagesFailure({ error: error.message })))
            )
        }
        )
    ));
}