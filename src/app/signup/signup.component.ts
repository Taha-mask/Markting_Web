import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true, // ✅ تأكد من أن المكون Standalone
  imports: [CommonModule, ReactiveFormsModule], // ✅ إضافة ReactiveFormsModule هنا
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isSeller: boolean = false; // للتحكم في إظهار الحقول الإضافية

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      accountType: ['user'], // القيمة الافتراضية "مستخدم"
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      storeName: [''],
      storeAddress: ['']
    });
  }

  onAccountTypeChange() {
    this.isSeller = this.registerForm.get('accountType')?.value === 'seller';

    if (this.isSeller) {
      this.registerForm.get('storeName')?.setValidators(Validators.required);
      this.registerForm.get('storeAddress')?.setValidators(Validators.required);
    } else {
      this.registerForm.get('storeName')?.clearValidators();
      this.registerForm.get('storeAddress')?.clearValidators();
    }

    this.registerForm.get('storeName')?.updateValueAndValidity();
    this.registerForm.get('storeAddress')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('بيانات المستخدم:', this.registerForm.value);
      alert('تم التسجيل بنجاح!');
    }
  }
}
