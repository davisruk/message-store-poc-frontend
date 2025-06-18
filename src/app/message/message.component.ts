import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, inject, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { selectSelectedMessages } from '../state/message.selectors';
import { Store } from '@ngrx/store';
import { combineLatest, debounceTime, distinctUntilChanged, map, Observable, startWith, Subscription, take } from 'rxjs';
import { Message } from '../state/state';
import { MatIconModule } from '@angular/material/icon';
import { addSelectedMessage, formatMessage } from '../state/message.actions';
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
  showFormatted = false;
  currentMatchIndex = 0;
  highlightedElements: HTMLElement[]=[];
  @ViewChild('#messageContainer', { static: false }) messageContainer!: ElementRef;
  @ViewChildren('messageContainer') containers!: QueryList<ElementRef>;
  
  private sub = new Subscription();
  private sanitizer = inject(DomSanitizer);
  private cdr = inject(ChangeDetectorRef);
  private previousMarkCount = 0;

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
      .subscribe(() => this.renderPayload())
    );
  }

  ngAfterViewChecked(): void {
    const messageContainer = this.containers.first;
    if (!messageContainer) {
      return;
    } 

    const nativeElement = messageContainer.nativeElement as HTMLElement;
    const currentMarks = nativeElement.querySelectorAll('mark');
    if (currentMarks.length !== this.previousMarkCount) {
      this.highlightedElements = Array.from(currentMarks);
      this.previousMarkCount = currentMarks.length;
      this.currentMatchIndex = 0;
      this.scrollToMatch(this.currentMatchIndex)
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  scrollToMatch(index: number){
    if (!this.highlightedElements || ! this.highlightedElements[index]) return;

    this.highlightedElements.forEach(el => el.classList.remove('highlight-active'));
    const current = this.highlightedElements[index];
    current.classList.add('highlight-active');
    current.scrollIntoView({behavior: 'smooth', block: 'center'});
  }

  nextMatch(): void {
    if (this.currentMatchIndex < this.highlightedElements.length - 1) {
      this.currentMatchIndex++;
      this.scrollToMatch(this.currentMatchIndex);
    }
  }

  previousMatch(): void {
    if (this.currentMatchIndex > 0) {
      this.currentMatchIndex--;
      this.scrollToMatch(this.currentMatchIndex)
    }
  }

  get totalMatches(): number {
    return this.highlightedElements?.length || 0;
  }

  get canGoPrevious(): boolean {
    return this.currentMatchIndex > 0;
  }

  get canGoNext(): boolean {
    return this.currentMatchIndex < this.totalMatches - 1;
  }

  clearSearch(event: Event) {
    event.stopPropagation();
    this.searchControl.setValue('');
  }

  onToggleFormat() {
    this.message$.pipe(take(1)).subscribe(msg => {
      if (!msg) return;
      // flip the flag
      this.showFormatted = !this.showFormatted;

      // if we're about to show formatted and need to fetch it:
      if (this.showFormatted && !msg.formattedPayload && msg.formatUrl) {
        this.store.dispatch(formatMessage({ id: msg.id }));
      }

      // force a re-evaluation of the combined stream:
      this.renderPayload();
    });
  }
  
  onClose(event: Event) {
    event.stopPropagation();
    this.message$.pipe(take(1)).subscribe(message => {
      if (message) {
        this.store.dispatch(addSelectedMessage({ message }));
      }
    });
  }

  onFormat() {
    this.message$.pipe(take(1)).subscribe(msg => {
      if (msg?.id && msg.formatUrl && !msg.formattedPayload) {
        this.store.dispatch(formatMessage({ id: msg.id }));
      }
    });
  }

  /** escape HTML so formattedPayload shows as text */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  private highlightRaw(raw: string, term: string): string {
    if (!term) return this.escapeHtml(raw);
    const esc = (t: string) =>
      t.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const re = new RegExp(`(${esc(term)})`, 'gi');
    return this.escapeHtml(raw).replace(re, `<mark>$1</mark>`);
  }

  private renderPayload() {
    this.message$.pipe(take(1)).subscribe(msg => {
      if (!msg) {
        this.highlightedHtml = '';
        return;
      }

      var raw = msg.payload ?? '';
      const term = this.searchControl.value;

      let htmlToShow: string;
      if (this.showFormatted && msg.formattedPayload) {
        raw = msg.formattedPayload;
      } 
      if (term) {
        htmlToShow = this.highlightRaw(raw, term);
      } else {
        htmlToShow = this.escapeHtml(raw);
      }
      this.highlightedHtml = this.sanitizer.bypassSecurityTrustHtml(htmlToShow);
    });
  }
}
