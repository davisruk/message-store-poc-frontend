import { Component } from '@angular/core';
import { MessageListComponent } from "./message-list/message-list.component";
import { MessageComponent } from './message/message.component';
@Component({
  selector: 'app-root',
  imports: [MessageListComponent, MessageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'message-store-poc-frontend';
}
