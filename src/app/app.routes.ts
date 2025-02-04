import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

import { TrendingSidebarComponent } from './components/trending-sidebar/trending-sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/settings/sidebar/sidebar.component';
import { MainContentComponent } from './components/settings/main-content/main-content.component';
import { NotificationComponent } from './components/notification/notification.component';
import { SettingComponent } from './components/settings/setting/setting.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FeedComponent } from './components/feed/feed.component';
import { SignupUserComponent } from './components/ٍsign_up/signup-user/signup-user.component';
import { SignupMarketerComponent } from './components/ٍsign_up/signup-marketer/signup-marketer.component.spec';
import { TypeAccountComponent } from './components/ٍsign_up/type-account/type-account.component';
import { GiveFeedbackComponent } from './components/give-feedback/give-feedback.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { AboutComponent } from './components/about/about.component';
export const routes: Routes = [


    {path: 'feed' , component : FeedComponent},
    {path: 'profile' , component : ProfileComponent},
    {path: 'notf' , component : NotificationComponent},
    {path: 'setting' , component : SettingComponent},
    {path: 'maincontent' , component : MainContentComponent},
    {path: 'sidebarsetting' , component : SidebarComponent},
    {path: 'SignupMarkter' , component : SignupMarketerComponent},
    {path: 'SignupUser' , component : SignupUserComponent},
    {path: 'TypeAccount' , component : TypeAccountComponent},
    {path: 'givefeedback' , component : GiveFeedbackComponent},
    {path: 'login' , component : LoginFormComponent},
    {path: 'about' , component : AboutComponent},

{
        path: '',
        pathMatch : 'full',
        redirectTo : '/feed'

       }



];
