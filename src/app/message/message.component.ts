import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { selectSelectedMessages } from '../state/message.selectors';
import { Store } from '@ngrx/store';
import { map, Observable, take } from 'rxjs';
import { Message } from '../state/state';
import { MatIconModule } from '@angular/material/icon';
import { addSelectedMessage } from '../state/message.actions';

@Component({
  selector: 'app-message',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  store:Store = inject(Store);
  @Input() messageIndex!: number;
  message$: Observable<Message | null>;

  constructor(){
    this.message$ = this.store.select(selectSelectedMessages).pipe(
      map(messages => messages[this.messageIndex] ?? null));
  }

  onClose() {
    this.message$.pipe(take(1)).subscribe(message => {
      if (message) {
        this.store.dispatch(addSelectedMessage({ message }));
      }
    });
  }
}
