import { CommonModule, AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { MessageListComponent } from '../message-list/message-list.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { Store } from '@ngrx/store';
import { Observable, startWith } from 'rxjs';
import { MESSAGE_DETAIL_PATH } from '../app.routes';
import { selectSelectedMessages } from '../state/message.selectors';
import { Message } from '../state/state';
import { MessageDetailComponent } from '../message-detail/message-detail.component';

@Component({
  selector: 'app-message-list-page',
  imports: [
    CommonModule,
    MessageListComponent,
    SearchBarComponent,
    MatExpansionModule,
    MessageDetailComponent
  ],
  templateUrl: './message-list-page.component.html',
  styleUrl: './message-list-page.component.css'
})
export class MessageListPageComponent {
  private router=inject(Router);
  selectedMessages$: Observable<Message[]> = inject(Store).select(selectSelectedMessages).pipe(
    startWith([]) // Emit an empty array as the default value
  );
  title = 'message-store-poc-frontend';
  isMaximized = false;
  panelExpanded = true;

  toggleMaximize() {
    this.router.navigate([MESSAGE_DETAIL_PATH]);
  }

  onMaximizeClick(event: MouseEvent){
    event.stopPropagation(); // Prevent the click event from propagating to the parent element
    this.toggleMaximize();
  }

  onHeaderClick(event: MouseEvent): void {
    if (this.isMaximized) {
      event.stopPropagation(); // stop header click from toggling expansion
    }
  }
}
