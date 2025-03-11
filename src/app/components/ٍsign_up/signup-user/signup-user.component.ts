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
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from "../../navbar/navbar.component";
import { UserService } from '../../services/User.service';
@Component({
  selector: 'app-signup-user',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule, NgFor],
  templateUrl: './signup-user.component.html',
  styleUrls: ['./signup-user.component.css'],
})
export class SignupUserComponent implements OnInit {
  userRegisterForm: FormGroup;
  countries: string[] = []; // قائمة الدول



  constructor(private http: HttpClient,private userService: UserService, private router: Router) {
    this.userRegisterForm = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z]{3,10}$')
      ]),
      secondName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
      birthDate: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      address: new FormGroup({
        city: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required]),
      }),
      primaryPhone: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{10,15}$')
      ]),
      secondaryPhone: new FormControl('', [
        Validators.pattern('^[0-9]{10,15}$')
      ]),
    });
  }
  ngOnInit() {
    this.fetchCountries(); // استدعاء API عند تحميل الصفحة
  }

  fetchCountries() {
    this.http.get<any[]>('https://restcountries.com/v3.1/all').subscribe(
      (response) => {
        this.countries = response.map(country => country.name.common).sort();
      },
      (error) => {
        console.error('Error fetching countries:', error);
      }
    );
  }

  register() {
    if (this.userRegisterForm.valid) {
      console.log('Form Data:', this.userRegisterForm.value);
      alert('Form submitted successfully!');
    } else {
      alert('Form is invalid!');
    }
  }
}
