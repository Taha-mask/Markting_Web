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
import { UserService } from '../../services/User.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
}

interface Country {
  name: string;
  code: string;
  flagCode: string;
  phoneLength: number;
}

@Component({
  selector: 'app-signup-marketer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
  ],
  providers: [UserService],
  templateUrl: './signup-marketer.component.html',
  styleUrls: ['./signup-marketer.component.css'],
})
export class SignupMarketerComponent implements OnInit {
  public marketerRegisterForm!: FormGroup<SignupMarketerForm>;
  public countries: Country[] = [];
  public showCountryDropdown = false;
  public isLoading = false;
  public passwordStrength = 0;
  public selectedProfileImage: File | null = null;
  public selectedIdImage: File | null = null;
  public defaultProfileImage = 'assets/images/default-profile.png';

  constructor(
    private userService: UserService,
    private router: Router,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {
    this.initForm();
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

  public onSubmit(): void {
    if (this.marketerRegisterForm.valid) {
      this.isLoading = true;

      const formData = new FormData();
      Object.keys(this.marketerRegisterForm.value).forEach((key) => {
        const value = this.marketerRegisterForm.get(key)?.value;
        if (value !== null && value !== undefined) {
          if (key === 'phone') {
            const countryCode = this.marketerRegisterForm.get('country')?.value;
            formData.append('phone', `${countryCode}${value}`);
          } else {
            formData.append(key, value);
          }
        }
      });

      if (this.selectedProfileImage) {
        formData.append('profileImage', this.selectedProfileImage);
      }
      if (this.selectedIdImage) {
        formData.append('idImage', this.selectedIdImage);
      }

      this.userService.registerMarketer(formData).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration failed:', error);
          this.isLoading = false;
          alert('Registration failed. Please try again.');
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    } else {
      this.marketerRegisterForm.markAllAsTouched();
    }
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