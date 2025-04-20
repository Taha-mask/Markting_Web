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
import { StatusComponent } from './components/status/status.component';
import { Error404Component } from './components/erorr404/error404.component';
import { Error500Component } from './components/error500/error500.component';
import { LoadingComponent } from './components/loading/loading.component';
import { LocationComponent } from './location/location.component';
import  {ReviewsComponent} from './reviews/reviews.component';
import {CartComponent} from './cart/cart.component';
import {SavedPostComponent} from './saved-post/saved-post.component'


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
  {path: 'status', component: StatusComponent},
  {path: 'error500', component: Error500Component},
  {path:'location',component: LocationComponent},
  {path:'loading',component: LoadingComponent},
  {path:'reviews',component: ReviewsComponent},
  {path:'cart',component: CartComponent},
  {path:'saved-post',component:SavedPostComponent},
  
  {
    path: 'right-sidebar',
    component: RightsideComponent,
    title: 'Right Sidebar'
  },
  {
    path: '',
    pathMatch : 'full',
    redirectTo : '/login'
  },
  {path:"**", component: Error404Component}
];
