import { Component } from '@angular/core';
import { FeedComponent } from './components/feed/feed.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RouterModule } from '@angular/router';
import { NotificationComponent } from "./components/notification/notification.component";
import { MainchatComponent } from "./components/mainchat/mainchat.component";
import { NinechatComponent } from "./components/ninechat/ninechat.component";
import { FiveprofileComponent } from "./components/fiveprofile/fiveprofile.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NotificationComponent, FeedComponent, NavbarComponent, MainchatComponent, NinechatComponent, FiveprofileComponent],
  templateUrl:'./app.component.html',
  styleUrls: ['./app.component.css']

})
export class AppComponent {

  title = 'My Angular App';


}
