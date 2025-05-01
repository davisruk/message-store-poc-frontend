import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { selectSelectedMessages } from '../state/message.selectors';
import { Store } from '@ngrx/store';
import { combineLatest, debounceTime, distinctUntilChanged, map, Observable, startWith, Subscription, take } from 'rxjs';
import { Message } from '../state/state';
import { MatIconModule } from '@angular/material/icon';
import { addSelectedMessage } from '../state/message.actions';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-message',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  store:Store = inject(Store);
  @Input() messageIndex!: number;
  message$: Observable<Message | null>;
  searchControl = new FormControl<string>('', { nonNullable: true });
  highlightedHtml: SafeHtml = '';

  private sub = new Subscription();
  private sanitizer = inject(DomSanitizer);

  constructor(){
    this.message$ = this.store.select(selectSelectedMessages).pipe(
      map(messages => messages[this.messageIndex] ?? null));
  }

  ngOnInit() {
    this.sub.add(
      combineLatest([
        this.message$,
        this.searchControl.valueChanges.pipe(
          startWith(''),
          debounceTime(300),
          distinctUntilChanged()
        )
      ])
      .pipe(
        map(([message, term]) => {
          const payload = message?.payload ?? '';
          const raw = term
            ? this.hilight(payload, term)
            : payload;
          return this.sanitizer.bypassSecurityTrustHtml(raw);
        })
      )
      .subscribe(safe => this.highlightedHtml = safe)
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  clearSearch() {
    this.searchControl.setValue('');
  }

  private getPayload(): string {
    var val: string = ''; 
    this.message$.pipe(take(1)).subscribe(message => val = message?.payload ?? '');
    return val; 
  }

  private sanitize(payload: string): SafeHtml {

    return this.sanitizer.bypassSecurityTrustHtml(payload);
  }

  private escapeRegExp(text: string): string {
    return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }
  
  private hilight(text: string, term: string): string {
    // Normalize CRLF → LF if needed
    const normalized = text.replace(/\r\n/g, '\n');
    const re = new RegExp(`(${this.escapeRegExp(term)})`, 'gi');
    return normalized.replace(re, `<mark>$1</mark>`);
  }

  onClose() {
    this.message$.pipe(take(1)).subscribe(message => {
      if (message) {
        this.store.dispatch(addSelectedMessage({ message }));
      }
    });
  }
}
