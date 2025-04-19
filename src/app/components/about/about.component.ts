
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const scrollButton = document.getElementById('scroll-button') as HTMLAnchorElement;
    const targetSection = document.getElementById('why-brandit') as HTMLElement;

    if (scrollButton && targetSection) {
      scrollButton.addEventListener('click', (e) => {
        e.preventDefault();
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    }
  }
}
