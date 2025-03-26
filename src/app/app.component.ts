import { Component } from '@angular/core';
import { MessageListComponent } from "./message-list/message-list.component";

@Component({
  selector: 'app-root',
  imports: [MessageListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'message-store-poc-frontend';
}
