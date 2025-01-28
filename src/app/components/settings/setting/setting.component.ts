import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { NavbarComponent } from "../../navbar/navbar.component";
import { MainContentComponent } from '../main-content/main-content.component';
import { MainchatComponent } from "../../Messages/mainchat/mainchat.component";

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, MainContentComponent],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent {

}
