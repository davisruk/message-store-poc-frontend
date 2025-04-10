import { Component, inject } from '@angular/core';
import { MessageListComponent } from "./message-list/message-list.component";
import { MessageComponent } from './message/message.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { Store } from '@ngrx/store';
import { AsyncPipe, CommonModule } from '@angular/common';
import { selectSelectedMessages } from './state/message.selectors';
import { Observable, startWith } from 'rxjs';
import { Message } from './state/state';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    MessageListComponent,
    MessageComponent,
    SearchBarComponent,
    AsyncPipe,
    MatExpansionModule,
    MatIcon
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  selectedMessages$: Observable<Message[]> = inject(Store).select(selectSelectedMessages).pipe(
    startWith([]) // Emit an empty array as the default value
  );
  title = 'message-store-poc-frontend';
  isMaximized = false;
  panelExpanded = true;

  toggleMaximize() {
    this.isMaximized = !this.isMaximized;
    if (this.isMaximized) {
      this.panelExpanded = true;
    }
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
