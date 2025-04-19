import { Routes } from '@angular/router';
import { MessageComponent } from './components/Messages/message.component';
import { AppComponent } from './app.component';
import { ModalComponent } from './components/modal/modal.component';
import { NotificationComponent } from './components/notification/notification.component';
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
import { AccountCenterComponent } from './components/account-center/account-center.component';
import { RightsideComponent } from './components/rightside/rightside.component';
import { OrdersComponent } from './orders/orders.component';
import { BlogComponent } from './blog/blog.component';
import { SupportComponent } from './support/support.component';
import { PromotionsComponent } from './promotions/promotions.component';

export const routes: Routes = [
  {path: 'explore' , component : ExplorepageComponent},
  {path: 'messages' , component : MessageComponent},
  {path: 'feed' , component : FeedComponent},
  {path: 'profile' , component : ProfileComponent},
  {path: 'notf' , component : NotificationComponent},
  {path: 'TypeAccount' , component : TypeAccountComponent},
  {path: 'givefeedback' , component : GiveFeedbackComponent},
  {path: 'orders' , component : OrdersComponent},
  {path: 'blog' , component : BlogComponent},
  {path: 'promotions' , component : PromotionsComponent},
  {path: 'support' , component : SupportComponent},
  {path: 'login' , component : LoginFormComponent},
  {path: 'about' , component : AboutComponent},
  {path: 'Story' , component : InnerStoryComponent},
  {path: 'stories' , component : InnerStoryComponent},
  {path: 'Explore' , component : ExplorepageComponent},
  { path: 'create-post', component: ModalComponent },
  {path: 'signup-user', component: SignupUserComponent },
  { path: 'signup-marketer', component: SignupMarketerComponent },
  { path: 'type-account', component: TypeAccountComponent },
  {path: 'account-center', component: AccountCenterComponent},
  {
    path: 'right-sidebar', 
    component: RightsideComponent,
    title: 'Right Sidebar'
  },
  {
    path: '',
    pathMatch : 'full',
    redirectTo : '/login'
  }
];
