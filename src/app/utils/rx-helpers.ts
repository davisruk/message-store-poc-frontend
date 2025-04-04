import { DestroyRef, inject } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

// utility function that subscribes to an observable and automatically unsubscribes when the component is destroyed
// must pass in detroyRef rather than injecting it in the function because the function may not be called in a context
// where inject() works e.g. an Angular lifecycle function like ngOnInit or ngAfterViewInit
export function safeSubscribe<T> (obs: Observable<T>, destroyRef: DestroyRef, next: (value: T) => void): Subscription {
    return obs.pipe(takeUntilDestroyed(destroyRef)).subscribe(next);
}