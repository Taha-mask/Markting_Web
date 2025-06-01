import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserService } from '../../../services/User.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { FirebaseSupabaseService } from '../../../services/firebase-supabase.service';

interface SignupMarketerForm {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  gender: FormControl<string | null>;
  birthDate: FormControl<string | null>;
  email: FormControl<string | null>;
  country: FormControl<string | null>;
  phone: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
  companyName: FormControl<string | null>;
  companyWebsite: FormControl<string | null>;
  companyDescription: FormControl<string | null>;
  termsAccepted: FormControl<boolean | null>;
  location: FormControl<string | null>;
  nationalId: FormControl<string | null>;
}

interface Country {
  name: string;
  code: string;
  flagCode: string;
  phoneLength: number;
}

@Component({
    selector: 'app-signup-marketer',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        HttpClientModule,
    ],
    providers: [UserService, FirebaseSupabaseService],
    templateUrl: './signup-marketer.component.html',
    styleUrls: ['./signup-marketer.component.css']
})
export class SignupMarketerComponent implements OnInit {
  public marketerRegisterForm!: FormGroup<SignupMarketerForm>;
  public countries: Country[] = [];
  public showCountryDropdown = false;
  public isLoading = false;
  public passwordStrength = 0;
  public selectedProfileImage: File | null = null;
  public selectedIdImage: File | null = null;
  public defaultProfileImage = 'images/user-1.png';
  public showSuccessMessage = false;
  public successMessage = '';


  constructor(
    private userService: UserService,
    private router: Router,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private firebaseSupabaseService: FirebaseSupabaseService

  ) {
    this.initForm();
    this.marketerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      companyWebsite: ['', [Validators.required]],
      companyDescription: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  public ngOnInit(): void {
    this.loadCountries();
  }

  public getMaxDate(): string {
    const today = new Date();
    const maxDate = new Date(today.setFullYear(today.getFullYear() - 18));
    return maxDate.toISOString().split('T')[0];
  }

  public getImageUrl(file: File | null): SafeUrl {
    if (!file) {
      return this.defaultProfileImage;
    }
    const url = URL.createObjectURL(file);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  public triggerProfileImageUpload(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        this.selectedProfileImage = target.files[0];
      }
    };
    input.click();
  }

  public onIdImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedIdImage = input.files[0];
    }
  }

  public checkPasswordStrength(event: Event): void {
    const password = (event.target as HTMLInputElement).value;
    let strength = 0;

    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    if (password.length >= 12) strength++;

    this.passwordStrength = (strength / 5) * 100;
  }

  public toggleCountryDropdown(): void {
    this.showCountryDropdown = !this.showCountryDropdown;
  }

  public selectCountry(country: Country): void {
    this.marketerRegisterForm.get('country')?.setValue(country.code);
    this.updatePhoneValidation();
    this.showCountryDropdown = false;
  }

  public updatePhoneValidation(): void {
    const countryCode = this.marketerRegisterForm.get('country')?.value;
    const selectedCountry = this.countries.find(c => c.code === countryCode);
    const phoneControl = this.marketerRegisterForm.get('phone');

    if (selectedCountry) {
      phoneControl?.setValidators([
        Validators.required,
        Validators.pattern(`^[0-9]{${selectedCountry.phoneLength}}$`)
      ]);
    } else {
      phoneControl?.setValidators([Validators.required]);
    }
    phoneControl?.updateValueAndValidity();
  }

  public getPhonePlaceholder(): string {
    return 'Enter phone';
  }

  public getSelectedCountryFlagCode(): string {
    const countryCode = this.marketerRegisterForm.get('country')?.value;
    const selectedCountry = this.countries.find(c => c.code === countryCode);
    return selectedCountry ? selectedCountry.flagCode : '';
  }

  public async onSubmit(): Promise<void> {
    if (this.marketerRegisterForm.valid) {
      this.isLoading = true;
      this.showSuccessMessage = false;
      console.log('Starting marketer registration process...');

      try {
          // Get birth date value safely
          const birthDateValue = this.marketerRegisterForm.get('birthDate')?.value;
        let birthDateString = birthDateValue ? new Date(birthDateValue).toISOString().split('T')[0] : '';

        // Prepare data for Firebase
          const marketerData = {
          birthDate: birthDateString,
          email: this.marketerRegisterForm.get('email')?.value || '',
          userName: this.marketerRegisterForm.get('firstName')?.value + '_' + this.marketerRegisterForm.get('lastName')?.value,
          gender: this.marketerRegisterForm.get('gender')?.value || '',
          lastName: this.marketerRegisterForm.get('lastName')?.value || '',
          firstName: this.marketerRegisterForm.get('firstName')?.value || '',
          status: 'active',
          role: 'Marketer',
          createdAt: new Date().toISOString().split('T')[0],
          password: this.marketerRegisterForm.get('password')?.value || '',
          description: this.marketerRegisterForm.get('companyDescription')?.value || '',
          phoneNumber: this.marketerRegisterForm.get('phone')?.value || '',
          companyName: this.marketerRegisterForm.get('companyName')?.value || '',
          companyWebsite: this.marketerRegisterForm.get('companyWebsite')?.value || '',
          acceptTerms: this.marketerRegisterForm.get('termsAccepted')?.value === true,
          userType: 1,
          location: this.marketerRegisterForm.get('location')?.value || '',
          nationalId: this.marketerRegisterForm.get('nationalId')?.value || '',
        };

        // Add data to Firebase
        try {
          // First create the user in Firebase Authentication
          const email = this.marketerRegisterForm.get('email')?.value || '';
          const password = this.marketerRegisterForm.get('password')?.value || '';
          
          const userId = await this.firebaseSupabaseService.createUser(email, password);
          console.log("User created in Authentication with ID:", userId);

          // Then add the document to Firestore
          const docId = await this.firebaseSupabaseService.addDocument('marketers', {
            ...marketerData,
            uid: userId // Add the Authentication UID to the document
          });
          console.log("Document written with ID: ", docId);

          // Store user data in localStorage with the document ID
          localStorage.setItem('currentUser', JSON.stringify({
            id: docId,
            uid: userId,
            ...marketerData
          }));
              
              // Show success message
              this.showSuccessMessage = true;
          this.successMessage = 'Registration successful! You will be redirected to the feed page in a moment.';
              
          // Navigate to feed page after a short delay
              setTimeout(() => {
            this.router.navigate(['/feed']);
              }, 3000);
        } catch (error) {
          console.error('Error in registration process:', error);
          throw new Error('Failed to create account. Please try again.');
        }

      } catch (error: any) {
              console.error('Registration failed:', error);
              this.isLoading = false;

              let errorMessage = 'Registration failed. ';
        if (error.message) {
          errorMessage += error.message;
              } else {
                errorMessage += 'An unexpected error occurred. Please try again.';
              }

              alert(errorMessage);
            }
    } else {
      this.marketerRegisterForm.markAllAsTouched();
      const formErrors = this.getFormValidationErrors();
      if (formErrors.length > 0) {
        alert('Please fix the following errors:\n' + formErrors.join('\n'));
      } else {
        alert('Please check your form for any errors.');
     
  // Success message properties
  public showSuccessMessage = false;
  public successMessage = '';

  public async onSubmit(): Promise<void> {
    if (this.marketerRegisterForm.invalid) {
      this.marketerRegisterForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      const { email, password } = this.marketerRegisterForm.value;

      // Register user in Firebase Auth
      const userCredential = await this.firebaseService.register(email!, password!);

      // Upload profile image if selected
      let profileImageUrl = '';
      if (this.selectedProfileImage) {
        profileImageUrl = await this.supabaseService.uploadUserAvatar(this.selectedProfileImage);
      }

      // Upload ID image if selected
      let idImageUrl = '';
      if (this.selectedIdImage) {
        idImageUrl = await this.supabaseService.uploadMarketerId(this.selectedIdImage);
      }

      // Create marketer data object
          const marketerData = {
        firstName: this.marketerRegisterForm.value.firstName,
        lastName: this.marketerRegisterForm.value.lastName,
        email: this.marketerRegisterForm.value.email,
        phone: this.marketerRegisterForm.value.phone,
        gender: this.marketerRegisterForm.value.gender,
        birthDate: this.marketerRegisterForm.value.birthDate,
        country: this.marketerRegisterForm.value.country,
        companyName: this.marketerRegisterForm.value.companyName,
        companyWebsite: this.marketerRegisterForm.value.companyWebsite,
        companyDescription: this.marketerRegisterForm.value.companyDescription,
        profileImage: profileImageUrl,
        idDocument: idImageUrl,
        role: 'marketer'
      };

      // Add marketer data to Firestore
      await this.firebaseService.addMarketer(marketerData);

              // Show success message
              this.showSuccessMessage = true;
      this.successMessage = 'Registration successful! Redirecting to dashboard...';

              // Navigate to dashboard after a short delay
              setTimeout(() => {
                this.router.navigate(['/dashboard']);
      }, 2000);

    } catch (error: any) {
      console.error('Registration error:', error);
      this.error = error.message || 'An error occurred during registration.';
    } finally {
      this.loading = false;
    }
  }

  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      'firstName': 'First Name',
      'lastName': 'Last Name',
      'email': 'Email',
      'password': 'Password',
      'confirmPassword': 'Confirm Password',
      'phone': 'Phone Number',
      'country': 'Country',
      'birthDate': 'Birth Date',
      'gender': 'Gender',
      'companyName': 'Company Name',
      'companyWebsite': 'Company Website',
      'companyDescription': 'Company Description',
      'termsAccepted': 'Terms and Conditions'
    };
    return fieldNames[fieldName] || fieldName;
  }

  private getFormValidationErrors(): string[] {
    const errors: string[] = [];
    Object.keys(this.marketerRegisterForm.controls).forEach(key => {
      const control = this.marketerRegisterForm.get(key);
      if (control?.errors) {
        Object.keys(control.errors).forEach(errorKey => {
          const fieldName = this.getFieldDisplayName(key);
          switch (errorKey) {
            case 'required':
              errors.push(`${fieldName} is required`);
              break;
            case 'email':
              errors.push('Please enter a valid email address');
              break;
            case 'minlength':
              if (control.errors?.[errorKey]?.requiredLength) {
                errors.push(`${fieldName} must be at least ${control.errors[errorKey].requiredLength} characters`);
              }
              break;
            case 'pattern':
              errors.push(`${fieldName} format is invalid`);
              break;
            case 'weakPassword':
              errors.push('Password is too weak. Please use a stronger password with uppercase, lowercase, numbers, and special characters');
              break;
            case 'passwordMismatch':
              errors.push('Passwords do not match');
              break;
            case 'underAge':
              errors.push('You must be at least 18 years old');
              break;
            default:
              errors.push(`${fieldName} is invalid`);
          }
        });
      }
    });
    return errors;
  }

  public initForm(): void {
    this.marketerRegisterForm = new FormGroup<SignupMarketerForm>(
      {
        firstName: new FormControl('', {
          validators: [Validators.required, Validators.minLength(2)],
          nonNullable: true,
        }),
        lastName: new FormControl('', {
          validators: [Validators.required, Validators.minLength(2)],
          nonNullable: true,
        }),
        gender: new FormControl('', {
          validators: [Validators.required],
          nonNullable: true,
        }),
        birthDate: new FormControl('', {
          validators: [Validators.required, this.ageValidator.bind(this)],
          nonNullable: true,
        }),
        email: new FormControl('', {
          validators: [Validators.required, Validators.email],
          nonNullable: true,
        }),
        country: new FormControl('', {
          validators: [Validators.required],
          nonNullable: true,
        }),
        phone: new FormControl('', {
          validators: [Validators.required],
          nonNullable: true,
        }),
        password: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(8),
            this.passwordStrengthValidator.bind(this),
          ],
          nonNullable: true,
        }),
        confirmPassword: new FormControl('', {
          validators: [Validators.required],
          nonNullable: true,
        }),
        companyName: new FormControl('', {
          validators: [Validators.required, Validators.minLength(2)],
          nonNullable: true,
        }),
        companyWebsite: new FormControl('', {
          validators: [Validators.pattern('^https?://.*$')],
          nonNullable: true,
        }),
        companyDescription: new FormControl('', {
          validators: [Validators.required, Validators.minLength(20)],
          nonNullable: true,
        }),
        termsAccepted: new FormControl(false, {
          validators: [Validators.requiredTrue],
          nonNullable: true,
        }),
        location: new FormControl('', {
          validators: [Validators.required],
          nonNullable: true,
        }),
        nationalId: new FormControl('', {
          validators: [
            Validators.required,
            Validators.pattern('^[0-9]{14}$')
          ],
          nonNullable: true,
        }),
      },
      { validators: this.passwordMatchValidator.bind(this) }
    );
  }

  public loadCountries(): void {
    this.http.get<any[]>('https://restcountries.com/v3.1/all').subscribe({
      next: (data) => {
        this.countries = data.map(country => ({
          name: country.name.common,
          code: country.idd.root + (country.idd.suffixes?.[0] || ''),
          flagCode: country.cca2.toLowerCase(),
          phoneLength: this.getPhoneLength(country.idd.root + (country.idd.suffixes?.[0] || ''))
        })).sort((a, b) => a.name.localeCompare(b.name));
      },
      error: (error) => {
        console.error('Error loading countries:', error);
        this.countries = [
          { name: 'United States', code: '+1', flagCode: 'us', phoneLength: 10 },
          { name: 'Canada', code: '+1', flagCode: 'ca', phoneLength: 10 },
          { name: 'United Kingdom', code: '+44', flagCode: 'gb', phoneLength: 10 },
          { name: 'Egypt', code: '+20', flagCode: 'eg', phoneLength: 10 },
        ];
      },
    });
  }

  private getPhoneLength(code: string): number {
    const phoneLengths: { [key: string]: number } = {
      '+1': 10,  // USA, Canada
      '+44': 10, // UK
      '+20': 10, // Egypt
      '+33': 9,  // France
    };
    return phoneLengths[code] || 10;
  }

  public passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    let strength = 0;

    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    if (password.length >= 12) strength++;

    return strength < 3 ? { weakPassword: true } : null;
  }

  public passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  public ageValidator(control: AbstractControl): ValidationErrors | null {
    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age >= 18 ? null : { underAge: true };
  }
}
