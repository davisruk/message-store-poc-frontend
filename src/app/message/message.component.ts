import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { selectSelectedMessage } from '../state/message.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-message',
  imports: [CommonModule, MatCardModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  store:Store = inject(Store);
  selectedMessage$ = this.store.select(selectSelectedMessage);
}
