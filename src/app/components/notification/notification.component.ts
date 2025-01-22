import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { TrendingSidebarComponent } from "../trending-sidebar/trending-sidebar.component";

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [NavbarComponent, TrendingSidebarComponent],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {

}
