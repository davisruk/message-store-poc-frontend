import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectSelectedMessages } from '../state/message.selectors';
import { Message } from '../state/state';
import { Observable } from 'rxjs';
import { MessageComponent } from '../message/message.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-message-detail',
  imports: [CommonModule, MessageComponent, MatIconModule],
  templateUrl: './message-detail.component.html',
  styleUrl: './message-detail.component.css'
})
export class MessageDetailComponent {
  private store:Store = inject(Store);
  private router:Router = inject(Router);
  
  selectedMessages$:Observable<Message[]> = this.store.select(selectSelectedMessages);

  restore() {
    this.router.navigate(['/']);
  }
}
