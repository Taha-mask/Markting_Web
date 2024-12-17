import { Component } from '@angular/core';
import { FeedComponent } from './components/feed/feed.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NavbarComponent, FeedComponent,ProfileComponent],
  templateUrl:'./app.component.html',
  styleUrls: ['./app.component.css']

})
export class AppComponent {title = 'My Angular App';}
