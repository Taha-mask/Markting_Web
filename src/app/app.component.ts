import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";

import { TrendingSidebarComponent } from './components/trending-sidebar/trending-sidebar.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'My Angular App';
}
