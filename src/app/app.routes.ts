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

import { BlogComponent } from './components/blog/blog.component';
import { SupportComponent } from './components/support/support.component';
import { PromotionsComponent } from './components/promotions/promotions.component';
import { StatusComponent } from './components/status/status.component';
import { Error404Component } from './components/erorr404/error404.component';
import { Error500Component } from './components/error500/error500.component';
import { LoadingComponent } from './components/loading/loading.component';
import { LocationComponent } from './components/location/location.component';
import  {ReviewsComponent} from './components/reviews/reviews.component';
import {CartComponent} from './components/cart/cart.component';
import {SavedPostComponent} from './components/saved-post/saved-post.component'
import { ProfileAsVisitorComponent } from './components/profile-as-visitor/profile-as-visitor.component';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { TermsAndPrivacyComponent } from './components/terms-and-privacy/terms-and-privacy.component';
import { ProfileAsCustomerComponent } from './components/profile-as-cutomer/profile-as-customer.component';
import { ProfileAsVisitorCustomerComponent } from './components/profile-as-visitor-customer/profile-as-visitor-customer.component';

import { PostoneComponent } from './components/postone/postone.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'feed',
    pathMatch: 'full'
  },
  {
    path: 'feed',
    loadComponent: () => import('./components/feed/feed.component').then(m => m.FeedComponent)
  },
  {
    path: 'explore',
    loadComponent: () => import('./components/explorepage/explorepage.component').then(m => m.ExplorepageComponent)
  },
  {
    path: 'account-center',
    loadComponent: () => import('./components/account-center/account-center.component').then(m => m.AccountCenterComponent)
  },
  {path: 'messages' , component : MessageComponent},
  {path: 'profile' , component : ProfileComponent},
  {path: 'notf' , component : NotificationComponent},
  {path: 'TypeAccount' , component : TypeAccountComponent},
  {path: 'givefeedback' , component : GiveFeedbackComponent},
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
  {path: 'status', component: StatusComponent},
  {path: 'error500', component: Error500Component},
  {path:'location',component: LocationComponent},
  {path:'loading',component: LoadingComponent},
  {path:'reviews',component: ReviewsComponent},
  {path:'cart',component: CartComponent},
  {path:'Saved-post',component:SavedPostComponent},
  {path:'search',component:SearchPageComponent},
  {path:'terms-and-privacy', component: TermsAndPrivacyComponent},
<<<<<<< HEAD
  {path:'profile-as-customer', component: ProfileAsCustomerComponent},
  {path:'profile-as-visitor-as-customer', component: ProfileAsVisitorCustomerComponent},
  {path:'profile-as-visitor', component: ProfileAsVisitorComponent},
=======


  {path: 'postone' ,component:PostoneComponent},

>>>>>>> 45c8083fd5211f38846a0630e2303566d1a35edf
  {
    path: 'right-sidebar',
    component: RightsideComponent,
    title: 'Right Sidebar'
  },
  {path:"**", component: Error404Component}
];
