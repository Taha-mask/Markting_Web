import { Component } from '@angular/core';

@Component({
  selector: 'app-profile-sidebar',
  standalone: true,
  templateUrl: './profile-sidebar.component.html',
  styleUrls: ['./profile-sidebar.component.css']
})
export class ProfileSidebarComponent {
  username = "John Doe";
  title = "Data Analyst at IBM";
  profileViews = 24;
  postViews = 128;
  connections = 108;
}
