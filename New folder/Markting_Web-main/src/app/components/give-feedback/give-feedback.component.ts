import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-give-feedback',
  standalone: true,
  imports: [NavbarComponent, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './give-feedback.component.html',
  styleUrl: './give-feedback.component.css'
})
export class GiveFeedbackComponent {
  feedbackForm: FormGroup;
  stars = [1, 2, 3, 4, 5]; // عدد النجوم
  currentRating = 0; // التقييم الحالي
  hoverRating = 0; // التقييم عند التمرير
  isLoading = false;
  showSuccess = false;
  showError = false;
  errorMessage = '';
  selectedFile: File | null = null;

  feedbackCategories = [
    'Website Experience',
    'Content Quality',
    'User Interface',
    'Performance',
    'Features',
    'Other'
  ];

  constructor(private fb: FormBuilder) {
    this.feedbackForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      category: ['', Validators.required],
      hadTrouble: ['', Validators.required],
      sharedWebsite: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
      attachment: [null]
    });
  }

  rate(rating: number): void {
    this.currentRating = rating; // تعيين التقييم عند النقر
    this.feedbackForm.patchValue({ rating });
  }

  highlight(rating: number): void {
    this.hoverRating = rating; // تلوين النجوم عند التمرير
  }

  resetHighlight(): void {
    this.hoverRating = 0; // إعادة النجوم إلى الحالة الافتراضية عند إزالة المؤشر
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size <= 5 * 1024 * 1024) { // 5MB limit
        this.selectedFile = file;
        this.feedbackForm.patchValue({ attachment: file });
      } else {
        this.showError = true;
        this.errorMessage = 'File size should not exceed 5MB';
        setTimeout(() => this.showError = false, 3000);
      }
    }
  }

  async onSubmit(): Promise<void> {
    if (this.feedbackForm.valid && this.currentRating > 0) {
      this.isLoading = true;
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Here you would typically send the form data to your backend
        console.log({
          ...this.feedbackForm.value,
          rating: this.currentRating,
          file: this.selectedFile
        });

        this.showSuccess = true;
        this.feedbackForm.reset();
        this.currentRating = 0;
        this.selectedFile = null;

        setTimeout(() => this.showSuccess = false, 3000);
      } catch (error) {
        this.showError = true;
        this.errorMessage = 'Failed to submit feedback. Please try again.';
        setTimeout(() => this.showError = false, 3000);
      } finally {
        this.isLoading = false;
      }
    } else {
      this.showError = true;
      this.errorMessage = 'Please fill all required fields and provide a rating';
      setTimeout(() => this.showError = false, 3000);
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.feedbackForm.get(controlName);
    if (control?.errors) {
      if (control.errors['required']) return 'This field is required';
      if (control.errors['email']) return 'Please enter a valid email';
      if (control.errors['minlength']) return `Minimum length is ${control.errors['minlength'].requiredLength} characters`;
      if (control.errors['pattern']) return 'Please enter a valid phone number';
    }
    return '';
  }
}
