import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { messageReducer } from './state/message.reducer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'message-store-poc-frontend';
}

bootstrapApplication(AppComponent, { providers: [
  { provide: RouterOutlet, useValue: RouterOutlet },
  provideStore({ message: messageReducer })
] });
