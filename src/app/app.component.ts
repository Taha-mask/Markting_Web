import { Component } from '@angular/core';
import { FeedComponent } from './components/feed/feed.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, FeedComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container my-5">
      <app-feed></app-feed>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
