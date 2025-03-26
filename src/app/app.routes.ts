import { Routes } from '@angular/router';
import { MessageComponent } from './components/Messages/message.component';
import { AppComponent } from './app.component';
import { ModalComponent } from './components/modal/modal.component';
import { SettingsSidebarComponent } from './components/settings/sidebar/sidebar.component';
import { NotificationComponent } from './components/notification/notification.component';
import { SettingComponent } from './components/settings/setting/setting.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FeedComponent } from './components/feed/feed.component';
import { SignupUserComponent } from './components/ٍsign_up/signup-user/signup-user.component';
import { SignupMarketerComponent } from './components/ٍsign_up/signup-marketer/signup-marketer.component';
import { TypeAccountComponent } from './components/ٍsign_up/type-account/type-account.component';
import { GiveFeedbackComponent } from './components/give-feedback/give-feedback.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { AboutComponent } from './components/about/about.component';
import { InnerStoryComponent } from './components/inner-story/inner-story.component';
import { ExplorepageComponent } from './components/explorepage/explorepage.component';

export const routes: Routes = [
  {path: 'explore' , component : ExplorepageComponent},
  {path: 'messages' , component : MessageComponent},
  {path: 'feed' , component : FeedComponent},
  {path: 'profile' , component : ProfileComponent},
  {path: 'notf' , component : NotificationComponent},
  {path: 'setting' , component : SettingComponent},
  {path: 'sidebarsetting' , component : SettingsSidebarComponent},
  {path: 'TypeAccount' , component : TypeAccountComponent},
  {path: 'givefeedback' , component : GiveFeedbackComponent},
  {path: 'login' , component : LoginFormComponent},
  {path: 'about' , component : AboutComponent},
  {path: 'Story' , component : InnerStoryComponent},
  {path: 'stories' , component : InnerStoryComponent},
  {path: 'Explore' , component : ExplorepageComponent},
  { path: 'create-post', component: ModalComponent },
  {path: 'signup-user', component: SignupUserComponent },
  { path: 'signup-marketer', component: SignupMarketerComponent },
  { path: 'type-account', component: TypeAccountComponent },
  {
    path: 'settings', 
 

  },
  {
    path: '',
    pathMatch : 'full',
    redirectTo : '/login'
  }
];
