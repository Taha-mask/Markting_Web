import { JsonPipe, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup-marketer',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule, JsonPipe, NgFor],
  templateUrl: './signup-marketer.component.html',
  styleUrls: ['./signup-marketer.component.css'],
})
export class SignupMarketerComponent implements OnInit {
  marketerRegisterForm: FormGroup;
  countries: string[] = [];

  constructor(private http: HttpClient) {
    this.marketerRegisterForm = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z]{3,10}$'),
      ]),
      secondName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),

      idNumber: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{10,15}$'),
      ]),

      idImage: new FormControl(null, [Validators.required]),

      country: new FormControl('', [Validators.required]),

      address: new FormGroup({
        city: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required]),
      }),

      primaryPhone: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{10,15}$'),
      ]),
      secondaryPhone: new FormControl('', [
        Validators.pattern('^[0-9]{10,15}$'),
      ]),

      shops: new FormArray([
        new FormGroup({
          shopName: new FormControl('', [Validators.required]),
          shopLocation: new FormControl('', [Validators.required]),
        }),
      ]),
    });
  }

  ngOnInit() {
    this.http.get<any[]>('https://restcountries.com/v3.1/all').subscribe(
      (data) => {
        this.countries = data.map((country) => country.name.common).sort();
      },
      (error) => {
        console.error('Error fetching countries:', error);
      }
    );
  }

  get Shops() {
    return this.marketerRegisterForm.get('shops') as FormArray;
  }
  
  createShop(): FormGroup {
    return new FormGroup({
      shopName: new FormControl('', [Validators.required]),
      shopLocation: new FormControl('', [Validators.required]),
    });
  }
  
  addNewShop() {
    if (this.Shops.length < 5) {
      this.Shops.push(this.createShop());
    }
  }
  
  deleteShop(index: number) {
    if (this.Shops.length > 1) {
      this.Shops.removeAt(index);
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.marketerRegisterForm.patchValue({ idImage: file });
    }
  }

  register() {
    if (this.marketerRegisterForm.valid) {
      const formData = new FormData();

      Object.keys(this.marketerRegisterForm.value).forEach((key) => {
        if (key === 'shops') {
          formData.append(key, JSON.stringify(this.marketerRegisterForm.value[key]));
        } else if (key === 'idImage') {
          formData.append(key, this.marketerRegisterForm.value[key]);
        } else {
          formData.append(key, this.marketerRegisterForm.value[key]);
        }
      });

      console.log('Form Data:', formData);
      alert('Form submitted successfully!');
    } else {
      alert('Form is invalid!');
    }
  }
}
