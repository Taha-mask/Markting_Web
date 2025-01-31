import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-give-feedback',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './give-feedback.component.html',
  styleUrl: './give-feedback.component.css'
})
export class GiveFeedbackComponent {
  stars = [1, 2, 3, 4, 5]; // عدد النجوم
  currentRating = 0; // التقييم الحالي
  hoverRating = 0; // التقييم عند التمرير

  rate(rating: number): void {
    this.currentRating = rating; // تعيين التقييم عند النقر
  }

  highlight(rating: number): void {
    this.hoverRating = rating; // تلوين النجوم عند التمرير
  }

  resetHighlight(): void {
    this.hoverRating = 0; // إعادة النجوم إلى الحالة الافتراضية عند إزالة المؤشر
  }
}
