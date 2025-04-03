import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatestWith, debounceTime, distinctUntilChanged, filter, map, startWith, take } from 'rxjs';
import { searchMessages, updateSearchCriteria } from '../state/message.actions';

@Component({
  selector: 'app-search-bar',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  private store: Store = inject(Store);

  searchControl = new FormControl<string>('', { nonNullable: true });
  includePayloadControl = new FormControl<boolean>(false, { nonNullable: true });

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        startWith(this.searchControl.value), // emit the initial value
        debounceTime(300), // wait for 300ms after the last event before emitting the value
        distinctUntilChanged(), // only emit if the value has changed
        filter(query => query.length === 0 || query.length >= 3), // only emit if the query is empty or has at least 3 characters
        combineLatestWith(this.includePayloadControl.valueChanges // combine with the includePayloadControl value changes
          .pipe(startWith(this.includePayloadControl.value)) // emit the initial value
        )
      )
      .subscribe(([query, includePayload]) => { // subscribe to the combined values
            this.store.dispatch(updateSearchCriteria({ query, includePayload })); // dispatch the updateSearchCriteria action
            this.store.dispatch(searchMessages());
          });
    };
}

