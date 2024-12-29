import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent {
  constructor(private router: Router) {}

  // ...existing code...

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }
}
