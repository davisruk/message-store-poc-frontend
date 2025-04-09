import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, filter, map, startWith } from 'rxjs';
import { searchMessages, updateColumnSearch } from '../state/message.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-columns-search-input',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule,MatButtonModule],
  templateUrl: './columns-search-input.component.html',
  styleUrl: './columns-search-input.component.css'
})
export class ColumnsSearchInputComponent {
  @Input() field!: string;
  @Input() label: string = '';

  private store = inject(Store);
  private destroyRef = inject(DestroyRef);
  control = new FormControl('');
  constructor() {
    this.control.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      filter(value => typeof value === 'string' && (value.length === 0 || value.length >= 3)),
      map (value => value ?? ''), // Ensure value is not null
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      this.store.dispatch(updateColumnSearch({ field: this.field, value: value }));
      this.store.dispatch(searchMessages());
    });
  }

  ngOnInit(){
    if (!this.label) {
      this.label = this.field;
    }
  }

  clear() {
    this.control.setValue('');
    this.store.dispatch(updateColumnSearch({ field: this.field, value: '' }));
    this.store.dispatch(searchMessages());
  }
}

