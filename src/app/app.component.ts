import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import {SavedPostComponent} from './components/saved-post/saved-post.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SavedPostComponent, RouterOutlet, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Markting_Web';
}
