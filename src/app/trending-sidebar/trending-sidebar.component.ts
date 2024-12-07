import { Component } from '@angular/core';

@Component({
  selector: 'app-trending-sidebar',
  standalone: true,
  templateUrl: './trending-sidebar.component.html',
  styleUrls: ['./trending-sidebar.component.css']
})
export class TrendingSidebarComponent {
  trendingNews = [
    { title: "High Demand for Skilled Employees", readers: 10934 },
    { title: "Inflation in Canada Affects the Workforce", readers: 7043 },
    { title: "Mass Recruiters fire Employees", readers: 17789 },
    { title: "Crypto predicted to Boom this year", readers: 2436 },
  ];
}
