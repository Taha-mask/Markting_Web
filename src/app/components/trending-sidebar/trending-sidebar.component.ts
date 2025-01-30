import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../user';

@Component({
  selector: 'app-trending-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trending-sidebar.component.html',
  styleUrls: ['./trending-sidebar.component.css']
})
export class TrendingSidebarComponent {
  profileImageUrl = 'https://randomuser.me/api/portraits/men/1.jpg'; // Sample profile image
   user: User[] = [
     {
       username: 'Taha Mahmoud ',
       type: 'Markter',
       profileImageUrl: 'images/user-1.png'
     }
   ];
}
