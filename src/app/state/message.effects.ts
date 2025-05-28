import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, catchError, of, switchMap, withLatestFrom, mergeMap, take } from "rxjs";
import { loadMessage, loadMessageSuccess, loadMessageFailure, searchMessages, searchMessagesSuccess, searchMessagesFailure, addSelectedMessage, formatMessage, formatMessageSuccess, formatMessageFailure } from "./message.actions";
import { MessageApiService } from "../services/message-api.service";
import { select, Store } from "@ngrx/store";
import { selectColumnSearch, selectIncludePayload, selectMessageById, selectPageNumber, selectPageSize, selectQuery, selectSortDescriptors } from "./message.selectors";

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

formatMessage$ = createEffect(() => this.actions$.pipe(
  ofType(formatMessage),
  mergeMap(action =>
    this.store.select(selectMessageById(action.id)).pipe(
      take(1),
      mergeMap(message => {
        if (message && message.formattedPayload) {
          return of(formatMessageSuccess({ id: action.id, formattedMessage: message.formattedPayload }));
        }
        if (!message) {
          return of(formatMessageFailure({ error: 'Message not found' }));
        }
        return this.messageService.formatMessage(message.formatUrl, message.payload).pipe(
          map(fp => formatMessageSuccess({ id: action.id, formattedMessage: fp })),
          catchError(error => of(formatMessageFailure({ error: error.message })))
        );
      })
    )
  )
));
}