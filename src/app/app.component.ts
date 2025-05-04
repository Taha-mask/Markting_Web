import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import {SavedPostComponent} from './components/saved-post/saved-post.component';
import { PostDetailsComponent } from './components/post-details/post-details.component';
import { InnerStoryComponent } from "./components/inner-story/inner-story.component";
import { ProfileAsVisitorComponent } from './components/profile-as-visitor/profile-as-visitor.component';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule,CommonModule, NavbarComponent, FooterComponent, PostDetailsComponent, InnerStoryComponent, ProfileAsVisitorComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Markting_Web';
}
