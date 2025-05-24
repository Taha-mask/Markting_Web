import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, Event } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { SavedPostComponent } from './components/saved-post/saved-post.component';
import { PostDetailsComponent } from './components/post-details/post-details.component';
// import { InnerStoryComponent } from "./components/inner-story/inner-story.component";
import { ProfileAsVisitorComponent } from './components/profile-as-visitor/profile-as-visitor.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Markting_Web';
  showNavbar = true;

  // Routes where navbar should be hidden
  private navbarHiddenRoutes = [
    '/login',
    '/signup-user',
    '/signup-marketer',
    '/TypeAccount',
    '/type-account',
    '/error404',
    '/error500',
    '/404',
    '/500'
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // Check initial route
    this.updateNavbarVisibility(this.router.url);

    // Subscribe to route changes
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateNavbarVisibility(event.url);
    });
  }

  private updateNavbarVisibility(url: string) {
    // Hide navbar on login and registration pages
    this.showNavbar = !this.navbarHiddenRoutes.some(route => url.startsWith(route));
  }
}
