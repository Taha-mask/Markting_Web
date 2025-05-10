import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import {SavedPostComponent} from './components/saved-post/saved-post.component';
import { PostDetailsComponent } from './components/post-details/post-details.component';
import { InnerStoryComponent } from "./components/inner-story/inner-story.component";
import { ProfileAsVisitorComponent } from './components/profile-as-visitor/profile-as-visitor.component';

import { ProfileAsCustomerComponent } from "./components/profile-as-cutomer/profile-as-customer.component";
import { ProfileAsVisitorCustomerComponent } from "./components/profile-as-visitor-customer/profile-as-visitor-customer.component";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, PostDetailsComponent, RouterOutlet, ProfileAsCustomerComponent, ProfileAsVisitorCustomerComponent,],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Markting_Web';
}
