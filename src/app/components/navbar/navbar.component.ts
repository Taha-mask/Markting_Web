import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {  ViewChild, ElementRef } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { ReportComponent } from "../report/report.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, ModalComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {






}

