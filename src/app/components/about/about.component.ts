import { Component } from '@angular/core';
 import { trigger, style, transition, animate, keyframes } from '@angular/animations';
 
 
 @Component({
   selector: 'app-about',
   standalone: true,
   imports: [],
   templateUrl: './about.component.html',
   styleUrl: './about.component.css',
     animations: [
     trigger('fadeInLeft', [
       transition(':enter', [
         style({ opacity: 0, transform: 'translateX(-50px)' }),
         animate('1s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
       ])
     ]),
     trigger('fadeInRight', [
       transition(':enter', [
         style({ opacity: 0, transform: 'translateX(50px)' }),
         animate('1s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
       ])
     ])
   ]
 })
 
 export class AboutComponent {
 showMoreText: boolean = false;
 
   toggleText(): void {
     this.showMoreText = !this.showMoreText;
   }
 
   scrollToSection() {
     const element = document.getElementById('todown');
     if (element) {
       element.scrollIntoView({ behavior: 'smooth' });
     }
   } 
 }