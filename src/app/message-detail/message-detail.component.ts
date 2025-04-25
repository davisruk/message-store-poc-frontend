import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectSelectedMessages } from '../state/message.selectors';
import { Message } from '../state/state';
import { map, Observable, startWith } from 'rxjs';
import { MessageComponent } from '../message/message.component';
import { MatIconModule } from '@angular/material/icon';
import { DiffService } from '../services/diff.service';
import { Change } from 'diff';
import { DiffViewerComponent } from '../diff-viewer/diff-viewer.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-message-detail',
  imports: [CommonModule, MessageComponent, MatIconModule, DiffViewerComponent, MatExpansionModule, MatButtonModule],
  templateUrl: './message-detail.component.html',
  styleUrl: './message-detail.component.css'
})
export class MessageDetailComponent {
  private store:Store = inject(Store);
  private router:Router = inject(Router);
  private diffService:DiffService = inject(DiffService);

  isMaximized = false;

  selectedMessages$:Observable<Message[]> = this.store.select(selectSelectedMessages).pipe(
    startWith([])
  );
  showDiff = false;

  // raw diffs when two messages are selected
  diffs$: Observable<Change[]> = this.selectedMessages$.pipe(
    map(messages => {
      if (messages.length === 2) {
        return this.diffService.diffMessages(messages[0].payload, messages[1].payload);
      }
      return [];
    })
  );

  // parts for the left side of the diff viewer
  leftDiff$ = this.diffs$.pipe(
    map(parts => parts.filter(part => part.removed || (!part.added && !part.removed)))
  );

  // parts for the right side of the diff viewer
  rightDiff$ = this.diffs$.pipe(
    map(parts => parts.filter(part => part.added || (!part.added && !part.removed)))
  );

  toggleDiff() {
    this.showDiff = !this.showDiff;
  }

  toggleMaximize(event: MouseEvent) {
    event.stopPropagation();
    this.isMaximized = !this.isMaximized;
  }

  onHeaderClick(event: MouseEvent) {
    if (this.isMaximized) {
      // when fullscreen, stop expand/collapse
      event.stopPropagation();
    }
  }
}