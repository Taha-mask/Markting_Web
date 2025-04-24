import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent {
  @ViewChild('reviewText') reviewTextRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('reviewsList') reviewsListRef!: ElementRef<HTMLDivElement>;

  stars = Array(5).fill(0);
  selectedRating = 5;

  constructor(private renderer: Renderer2) {}

  selectRating(rating: number): void {
    this.selectedRating = rating;
  }

  addReview(): void {
    const text = this.reviewTextRef.nativeElement.value.trim();
    if (text === '') return;

    const card = this.renderer.createElement('div');
    this.renderer.addClass(card, 'review-card');

    const name = this.renderer.createElement('div');
    this.renderer.addClass(name, 'name');
    const nameText = this.renderer.createText('Anonymous');
    this.renderer.appendChild(name, nameText);

    const stars = this.renderer.createElement('div');
    this.renderer.addClass(stars, 'stars');
    const starsText = this.renderer.createText('★'.repeat(this.selectedRating));
    this.renderer.appendChild(stars, starsText);

    const reviewText = this.renderer.createElement('p');
    const reviewTextContent = this.renderer.createText(text);
    this.renderer.appendChild(reviewText, reviewTextContent);

    this.renderer.appendChild(card, name);
    this.renderer.appendChild(card, stars);
    this.renderer.appendChild(card, reviewText);

    const parent = this.reviewsListRef.nativeElement;
    const firstChild = parent.firstChild;
    this.renderer.insertBefore(parent, card, firstChild);

    this.reviewTextRef.nativeElement.value = '';
    this.selectedRating = 5;
  }
}
