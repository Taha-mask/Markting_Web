import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-reviews',
    imports: [CommonModule, FormsModule],
    templateUrl: './reviews.component.html',
    styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent {
  Math = Math;

  reviews = [
    { username: 'Sara', comment: 'ممتاز جدًا', rating: 4 },
    { username: 'Layla', comment: 'حلو بس فيه شوية ملاحظات', rating: 3 },
  ];

  newReview = {
    username: '',
    comment: '',
    rating: 0
  };

  submitReview() {
    if (this.newReview.comment && this.newReview.rating > 0) {
      this.reviews.push({ ...this.newReview });
      this.newReview = { username: '', comment: '', rating: 0 };
    }
  }

  setRating(stars: number) {
    this.newReview.rating = stars;
  }

  hoverStar(stars: number) {
    this.newReview.rating = stars; 
  }

  resetStars() {
    if (this.newReview.rating === 0) {
      this.newReview.rating = 0;
    }
  }

  getAverageRating(): number {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    return this.reviews.length ? totalRating / this.reviews.length : 0;
  }
}
