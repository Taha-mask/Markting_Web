import { Component } from '@angular/core';
import { FeedComponent } from './components/feed/feed.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RouterModule } from '@angular/router';
import { NotificationComponent } from "./components/notification/notification.component";
import { MainchatComponent } from './components/Messages/mainchat/mainchat.component';
import { NinechatComponent } from "./components/Messages/ninechat/ninechat.component";
import { FiveprofileComponent } from './components/Messages/fiveprofile/fiveprofile.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl:'./app.component.html',
  styleUrls: ['./app.component.css']

})
export class AppComponent {

  title = 'My Angular App';


}
