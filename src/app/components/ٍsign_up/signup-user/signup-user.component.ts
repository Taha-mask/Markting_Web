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
  FormBuilder,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserService } from '../../../services/User.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FirebaseService } from '../../../services/firebase.service';
import { SupabaseService } from '../../../services/supabase.service';

interface UserRegisterForm {
  firstName: FormControl<string | null>;
  secondName: FormControl<string | null>;
  gender: FormControl<string | null>;
  birthDate: FormControl<string | null>;
  email: FormControl<string | null>;
  country: FormControl<string | null>;
  phone: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
  termsAccepted: FormControl<boolean | null>;
}

interface Country {
  name: string;
  code: string;
  flagCode: string;
  phoneLength: number;
}

@Component({
  selector: 'app-signup-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
  ],
  providers: [UserService],
  templateUrl: './signup-user.component.html',
  styleUrls: ['./signup-user.component.css'],
})
export class SignupUserComponent implements OnInit {
  public userRegisterForm!: FormGroup<UserRegisterForm>;
  public countries: Country[] = [];
  public showCountryDropdown = false;
  public isLoading = false;
  public passwordStrength = 0;
  public selectedProfileImage: File | null = null;
  public defaultProfileImage = 'assets/images/default-profile.png';
  public errorMessage: string | null = null;
  public userForm: FormGroup;

  constructor(
    private userService: UserService,
    private router: Router,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private supabaseService: SupabaseService,
    private firebaseService: FirebaseService
  ) {
    this.initForm();
    this.userForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      interests: ['', [Validators.required]],
      location: ['', [Validators.required]]
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
        const file = target.files[0];
        if (!file.type.match('image.*')) {
          this.errorMessage = 'Please select an image file (JPEG, PNG)';
          return;
        }
        if (file.size > 2 * 1024 * 1024) {
          this.errorMessage = 'Image size should be less than 2MB';
          return;
        }
        this.selectedProfileImage = file;
        this.errorMessage = null;
      }
    };
    input.click();
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
    this.userRegisterForm.get('country')?.setValue(country.code);
    this.updatePhoneValidation();
    this.showCountryDropdown = false;
  }

  public updatePhoneValidation(): void {
    const countryCode = this.userRegisterForm.get('country')?.value;
    const selectedCountry = this.countries.find((c) => c.code === countryCode);
    const phoneControl = this.userRegisterForm.get('phone');

    if (selectedCountry) {
      phoneControl?.setValidators([
        Validators.required,
        Validators.pattern(`^[0-9]{${selectedCountry.phoneLength}}$`),
        this.validatePhoneNumber.bind(this),
      ]);
    } else {
      phoneControl?.setValidators([Validators.required]);
    }
    phoneControl?.updateValueAndValidity();
  }

  private validatePhoneNumber(
    control: AbstractControl,
  ): ValidationErrors | null {
    const countryCode = this.userRegisterForm.get('country')?.value;
    const selectedCountry = this.countries.find((c) => c.code === countryCode);

    if (!selectedCountry || !control.value) return null;

    return control.value.length === selectedCountry.phoneLength
      ? null
      : { invalidLength: true };
  }

  public getPhonePlaceholder(): string {
    const countryCode = this.userRegisterForm.get('country')?.value;
    const selectedCountry = this.countries.find((c) => c.code === countryCode);
    return selectedCountry
      ? `Enter ${selectedCountry.phoneLength}-digit phone`
      : 'Enter phone';
  }

  public getSelectedCountryFlagCode(): string {
    const countryCode = this.userRegisterForm.get('country')?.value;
    const selectedCountry = this.countries.find((c) => c.code === countryCode);
    return selectedCountry ? selectedCountry.flagCode : '';
  }

  public register(): void {
    this.errorMessage = null;

    if (this.userRegisterForm.valid) {
      this.isLoading = true;

      // First, upload the profile image if selected
      if (this.selectedProfileImage) {
        this.uploadProfileImage()
          .then((imageUrl) => {
            // After image upload, proceed with user registration
            this.registerUser(imageUrl);
          })
          .catch((error) => {
            console.error('Image upload failed:', error);
            this.isLoading = false;
            this.errorMessage =
              'Failed to upload profile image. Please try again.';
          });
      } else {
        // No profile image, proceed with registration directly
        this.registerUser();
      }
    } else {
      // Form is invalid, show validation errors
      this.userRegisterForm.markAllAsTouched();
      this.errorMessage = 'Please fill all required fields correctly.';

      // Highlight the first invalid field
      const invalidControls = Object.keys(
        this.userRegisterForm.controls,
      ).filter((key) => this.userRegisterForm.get(key)?.invalid);

      if (invalidControls.length > 0) {
        const firstInvalidField = document.querySelector(
          `[formControlName=${invalidControls[0]}]`,
        );
        if (firstInvalidField) {
          (firstInvalidField as HTMLElement).focus();
        }
      }
    }
  }

  private uploadProfileImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.selectedProfileImage) {
        resolve('');
        return;
      }

      // For now, just resolve with a placeholder URL
      // TODO: Implement Firebase Storage upload
      resolve('https://via.placeholder.com/150');
    });
  }

  private registerUser(profileImageUrl: string = ''): void {
    const userData: Omit<User, 'id' | 'token'> = {
      firstName: this.userForm.value.firstName || '',
      lastName: this.userForm.value.lastName || '',
      email: this.userForm.value.email || '',
      phone: this.userForm.value.phone || '',
      password: this.userForm.value.password || '',
      role: 'user',
      profileImage: profileImageUrl
    };

    this.userService.register(userData).then(success => {
      if (success) {
        this.isLoading = false;
        this.errorMessage = null;
        alert('Registration successful! You will be redirected to the login page.');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      } else {
        this.errorMessage = 'Registration failed. Please try again.';
      }
    }).catch(error => {
      this.isLoading = false;
      this.errorMessage = error.message || 'Registration failed. Please try again.';
    });
  }

  public initForm(): void {
    this.userRegisterForm = new FormGroup<UserRegisterForm>(
      {
        firstName: new FormControl('', {
          validators: [Validators.required, Validators.minLength(2)],
          nonNullable: true,
        }),
        secondName: new FormControl('', {
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
        termsAccepted: new FormControl(false, {
          validators: [Validators.requiredTrue],
          nonNullable: true,
        }),
      },
      { validators: this.passwordMatchValidator.bind(this) },
    );
  }

  public loadCountries(): void {
    this.http.get<any[]>('https://restcountries.com/v3.1/all').subscribe({
      next: (data) => {
        this.countries = data
          .map((country) => ({
            name: country.name.common,
            code: country.idd.root + (country.idd.suffixes?.[0] || ''),
            flagCode: country.cca2.toLowerCase(),
            phoneLength: this.getPhoneLength(
              country.idd.root + (country.idd.suffixes?.[0] || ''),
            ),
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
      },
      error: (error) => {
        console.error('Error loading countries:', error);
        this.countries = [
          {
            name: 'United States',
            code: '+1',
            flagCode: 'us',
            phoneLength: 10,
          },
          { name: 'Canada', code: '+1', flagCode: 'ca', phoneLength: 10 },
          {
            name: 'United Kingdom',
            code: '+44',
            flagCode: 'gb',
            phoneLength: 10,
          },
          { name: 'Egypt', code: '+20', flagCode: 'eg', phoneLength: 10 },
        ];
      },
    });
  }

  private getPhoneLength(code: string): number {
    const phoneLengths: { [key: string]: number } = {
      '+1': 10, // USA, Canada
      '+44': 10, // UK
      '+20': 10, // Egypt
      '+33': 9, // France
    };
    return phoneLengths[code] || 10;
  }

  public passwordStrengthValidator(
    control: AbstractControl,
  ): ValidationErrors | null {
    const password = control.value;
    let strength = 0;

    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    if (password.length >= 12) strength++;

    return strength < 3 ? { weakPassword: true } : null;
  }

  public passwordMatchValidator(
    group: AbstractControl,
  ): ValidationErrors | null {
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

  async onSubmit() {
    if (this.userForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    try {
      // Register user in Firebase Auth
      const userCredential = await this.firebaseService.register(
        this.userForm.value.email,
        this.userForm.value.password
      );

      if (userCredential) {
        // Add user data to Firestore
        const userData = {
          firstName: this.userForm.value.firstName,
          lastName: this.userForm.value.lastName,
          email: this.userForm.value.email,
          phone: this.userForm.value.phone,
          interests: this.userForm.value.interests,
          location: this.userForm.value.location,
          role: 'user'
        };

        await this.firebaseService.addUser(userData);
        this.router.navigate(['/dashboard']);
      }
    } catch (error: any) {
      this.errorMessage = error.message || 'An error occurred during registration.';
    } finally {
      this.isLoading = false;
    }
  }
}
