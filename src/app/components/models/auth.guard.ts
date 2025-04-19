import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../services/User.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService, 
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): boolean {
    if (this.userService.isTokenValid()) {
      return true;
    }

    // Redirect to login page
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
}

// Separate routing configuration
import { Routes } from '@angular/router';
import { LoginFormComponent } from '../login-form/login-form.component';
import { FeedComponent } from '../feed/feed.component';
import { SignupUserComponent } from '../ٍsign_up/signup-user/signup-user.component';

export const routes: Routes = [
  { 
    path: 'feed', 
    component: FeedComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'login', 
    component: LoginFormComponent 
  },
  { 
    path: 'signup-user', 
    component: SignupUserComponent 
  },
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full' 
  }
];