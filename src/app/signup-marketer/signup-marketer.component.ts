
import { JsonPipe, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup-marketer',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule, JsonPipe, NgFor],
  templateUrl: './signup-marketer.component.html',
  styleUrls: ['./signup-marketer.component.css'],
})
export class SignupMarketerComponent {
  userRegisterForm: FormGroup;

  constructor() {
    this.userRegisterForm = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z]{3,10}$'),
      ]),
      secondName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
      
      // ID Number (National ID)
      idNumber: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{10,15}$'),
      ]),

      // ID Image Upload
      idImage: new FormControl(null, [Validators.required]),

      // Address Group
      address: new FormGroup({
        city: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required]),
      }),

      // Phone Numbers
      primaryPhone: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{10,15}$'),
      ]),
      secondaryPhone: new FormControl('', [
        Validators.pattern('^[0-9]{10,15}$'),
      ]),

      // Shops Array
      shops: new FormArray([
        new FormGroup({
          shopName: new FormControl('', [Validators.required]),
          shopLocation: new FormControl('', [Validators.required]),
        }),
      ]),
    });
  }

  // Getter for shops FormArray
  get Shops() {
    return this.userRegisterForm.get('shops') as FormArray;
  }

  // Function to create a new Shop FormGroup
  createShop(): FormGroup {
    return new FormGroup({
      shopName: new FormControl('', [Validators.required]),
      shopLocation: new FormControl('', [Validators.required]),
    });
  }

  // Add new shop (Max: 5)
  addNewShop() {
    if (this.Shops.length < 5) {
      this.Shops.push(this.createShop());
    }
  }

  // Delete shop (Min: 1)
  deleteShop(index: number) {
    if (this.Shops.length > 1) {
      this.Shops.removeAt(index);
    }
  }

  // Handle ID Image Upload
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.userRegisterForm.patchValue({ idImage: file });
    }
  }

  // Register function
  register() {
    if (this.userRegisterForm.valid) {
      const formData = new FormData();
      
      // Append form values
      Object.keys(this.userRegisterForm.value).forEach((key) => {
        if (key === 'shops') {
          formData.append(key, JSON.stringify(this.userRegisterForm.value[key]));
        } else if (key === 'idImage') {
          formData.append(key, this.userRegisterForm.value[key]);
        } else {
          formData.append(key, this.userRegisterForm.value[key]);
        }
      });

      console.log('Form Data:', formData);
      alert('Form submitted successfully!');
    } else {
      alert('Form is invalid!');
    }
  }
}
