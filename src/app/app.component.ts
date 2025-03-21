import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { messageReducer } from './state/message.reducer';
import { MessageListComponent } from "./message-list/message-list.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MessageListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'message-store-poc-frontend';
}
