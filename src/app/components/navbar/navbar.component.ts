import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {  ViewChild, ElementRef } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { ReportComponent } from "../report/report.component";
import { User } from '../../interfaces/user';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, ModalComponent, ReportComponent, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @ViewChild('reportModal') reportModal!: ElementRef;

  openReportModal() {
    const reportComponent = this.reportModal.nativeElement;
    reportComponent.openModal();
  }

  user: User[] = [
    {
      username: 'Taha Mahmoud ',
      type: 'Markter',
      profileImageUrl: 'images/user-1.png',
      status: 'Online',
    }
  ];
  }


