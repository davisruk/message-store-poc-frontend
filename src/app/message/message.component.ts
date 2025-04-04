import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { selectSelectedMessages } from '../state/message.selectors';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { Message } from '../state/state';

@Component({
  selector: 'app-message',
  imports: [CommonModule, MatCardModule],
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
}
