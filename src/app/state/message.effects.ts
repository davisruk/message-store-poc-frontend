import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, catchError, of, switchMap } from "rxjs";
import { loadMessageSummaries, loadMessageSummariesSuccess, loadMessageSummariesFailure } from "./message.actions";
import { MessageApiService } from "../services/message-api.service";

@Injectable()
export class MessageEffects {
    // use inject instead of constructor injection
    // ngRx DI sometimes calls the constructor before the
    // actions$ and other dependencies are available
    // alternatively, use a constructor to create the effects
    private actions$ = inject(Actions);
    private messageService = inject(MessageApiService);

    loadMessages$ = createEffect(() => this.actions$.pipe(
        ofType(loadMessageSummaries),
        switchMap(action => this.messageService.getMessageSummaries(action.pageNumber, action.size).pipe(
            map(response => loadMessageSummariesSuccess({ paginatedMessages: response })),
            catchError(error => of(loadMessageSummariesFailure({ error: error.message })))
        ))
    ));
}