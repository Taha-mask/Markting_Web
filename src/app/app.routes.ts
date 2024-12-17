// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { FeedComponent } from './components/feed/feed.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  { path: '', component: FeedComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: '' } // إعادة التوجيه إلى الصفحة الرئيسية لأي مسار غير معروف
];
