import { Component, Optional } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { ReportComponent } from "../report/report.component";
import { User } from '../../interfaces/user';
import { CommonModule } from '@angular/common';
import { MessageComponent } from '../Messages/message.component';

@Component({
    selector: 'app-navbar',
    imports: [RouterModule, ModalComponent, ReportComponent, CommonModule],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @ViewChild('reportModal') reportModal!: ElementRef;

  constructor(
    private router: Router,
    @Optional() public messageComponent: MessageComponent
  ) {}

  isMessagesRoute(): boolean {
    // Check if we're in the messages route
    if (!this.router.url.includes('/messages')) {
      return false;
    }
    
    // Get the MessageComponent instance if it exists
    const messageComponent = (window as any).messageComponent;
    if (messageComponent) {
      // Hide navbar only when a chat is selected
      return messageComponent.isChatSelected;
    }
    return false;
  }

  openReportModal() {
    const reportComponent = this.reportModal.nativeElement;
    reportComponent.openModal();
  }

  user: User[] = [
    {
      id: '1',
      username: 'Taha Mahmoud ',
      type: 'Markter',
      profileImageUrl: 'images/user-1.png',
      status: 'Online',
      role: 'user'
    }
  ];
}


