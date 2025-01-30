import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css']
})
export class MainContentComponent implements OnInit {
  passwordForm!: FormGroup;
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      logoutDevices: [false]
    });
  }

  togglePasswordVisibility(field: string) {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  passwordsMatch(): boolean {
    return this.passwordForm.get('newPassword')?.value === this.passwordForm.get('confirmPassword')?.value;
  }

  changePassword() {
    if (this.passwordForm.valid && this.passwordsMatch()) {
      console.log(this.passwordForm.value);
      alert('Password changed successfully!');
    } else {
      alert('Form is invalid or passwords do not match.');
    }
  }
}
