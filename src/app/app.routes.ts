import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ComComponent } from './components/Messages/com/com.component';
import { FirstchatComponent } from './components/Messages/firstchat/firstchat.component';
import { SecondchatComponent } from './components/Messages/secondchat/secondchat.component';
import { ThirdchatComponent } from './components/Messages/thirdchat/thirdchat.component';
import { FourchatComponent } from './components/Messages/fourchat/fourchat.component';
import { FivechatComponent } from './components/Messages/fivechat/fivechat.component';
import { SixchatComponent } from './components/Messages/sixchat/sixchat.component';
import { SivenchatComponent } from './components/Messages/sivenchat/sivenchat.component';
import { NinechatComponent } from './components/Messages/ninechat/ninechat.component';
import { TinchatComponent } from './components/Messages/tinchat/tinchat.component';
import { MainchatComponent } from './components/Messages/mainchat/mainchat.component';
import { FirstprofileComponent } from './components/Messages/firstprofile/firstprofile.component';
import { SecondprofileComponent } from './components/Messages/secondprofile/secondprofile.component';
import { ThirdprofileComponent } from './components/Messages/thirdprofile/thirdprofile.component';
import { FourprofileComponent } from './components/Messages/fourprofile/fourprofile.component';
import { FiveprofileComponent } from './components/Messages/fiveprofile/fiveprofile.component';
import { SixprofileComponent } from './components/Messages/sixprofile/sixprofile.component';
import { SivenprofileComponent } from './components/Messages/sivenprofile/sivenprofile.component';
import { EighthprofileComponent } from './components/Messages/eighthprofile/eighthprofile.component';
import { NinthprofileComponent } from './components/Messages/ninthprofile/ninthprofile.component';
import { TinthprofileComponent } from './components/Messages/tinthprofile/tinthprofile.component';
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


    {path: 'firstprofile' , component : FirstprofileComponent},
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

    {path: 'secondprofile' , component : SecondprofileComponent},
    {path: 'thirdprofile' , component :ThirdprofileComponent },
    {path: 'fourprofile' , component :FourprofileComponent },
    {path: 'fiveprofile' , component :FiveprofileComponent},
    {path: 'sixprofile' , component :SixprofileComponent },
    {path: 'sivenprofile' , component : SivenprofileComponent},
    {path: 'eighthprofile' , component :EighthprofileComponent },
    {path: 'ninthprofile' , component : NinthprofileComponent},
    {path: 'tinthprofile' , component :TinthprofileComponent },
    {path: 'com' , component :ComComponent },

   {path: 'first' , component : FirstchatComponent},

    {path: 'second' , component : SecondchatComponent},
    {path: 'app' , component : AppComponent},

    {path: 'third' , component : ThirdchatComponent},

    {path: 'four' , component : FourchatComponent},

    {path: 'five' , component : FivechatComponent},

    {path: 'six' , component : SixchatComponent},

    {path: 'siven' , component : SivenchatComponent},

    {path: 'nine' , component : NinechatComponent},
    {path: 'tin' , component : TinchatComponent},

    {path: 'main' , component : MainchatComponent},
    {

        path: '',
        pathMatch : 'full',
        redirectTo : '/feed'

       }



];
