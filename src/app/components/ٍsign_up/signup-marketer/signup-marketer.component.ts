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
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        HttpClientModule,
    ],
    providers: [UserService],
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

  // Success message properties
  public showSuccessMessage = false;
  public successMessage = '';

  public onSubmit(): void {
    if (this.marketerRegisterForm.valid) {
      this.isLoading = true;
      this.showSuccessMessage = false;
      console.log('Starting marketer registration process...');

      // First, handle file uploads if there are any
      const uploadTasks: Promise<any>[] = [];
      let profilePicturePath = 'default-profile.jpg';
      let userIDPath = 'default-id.jpg';

      // Upload profile image if selected
      if (this.selectedProfileImage) {
        const profileUploadTask = new Promise<any>((resolve, reject) => {
          this.userService.uploadFile(this.selectedProfileImage!).subscribe({
            next: (response: { filePath: string }) => {
              console.log('Profile image uploaded:', response);
              profilePicturePath = response.filePath;
              resolve(response);
            },
            error: (error: { message?: string, error?: any, status?: number }) => {
              console.error('Profile image upload failed:', error);
              resolve(null); // Resolve with null to continue the process
            }
          });
        });
        uploadTasks.push(profileUploadTask);
      }

      // Upload ID image if selected
      if (this.selectedIdImage) {
        const idUploadTask = new Promise<any>((resolve, reject) => {
          this.userService.uploadFile(this.selectedIdImage!).subscribe({
            next: (response: { filePath: string }) => {
              console.log('ID image uploaded:', response);
              userIDPath = response.filePath;
              resolve(response);
            },
            error: (error: { message?: string, error?: any, status?: number }) => {
              console.error('ID image upload failed:', error);
              resolve(null); // Resolve with null to continue the process
            }
          });
        });
        uploadTasks.push(idUploadTask);
      }

      // After all uploads are complete, proceed with user registration
      Promise.all(uploadTasks)
        .then(() => {
          console.log('All file uploads completed, proceeding with registration');

          // Get birth date value safely
          const birthDateValue = this.marketerRegisterForm.get('birthDate')?.value;
          let birthDateString = '';

          if (birthDateValue) {
            // Convert to ISO string and extract the date part
            birthDateString = new Date(birthDateValue).toISOString().split('T')[0];
          } else {
            // Fallback to current date if no birth date is provided
            birthDateString = new Date().toISOString().split('T')[0];
          }

          // Format data according to API expectations with proper casing and structure
          const marketerData = {
            BirthDate: birthDateString,
            Email: this.marketerRegisterForm.get('email')?.value || '',
            UserName: this.marketerRegisterForm.get('firstName')?.value + '_' + this.marketerRegisterForm.get('lastName')?.value,
            City: 'Assiut',
            Country: 'Egypt',
            Street: '15 El-Nasr Street',
            Gender: this.marketerRegisterForm.get('gender')?.value === 'male' ? 'M' : 'F',
            LastName: this.marketerRegisterForm.get('lastName')?.value || '',
            FirstName: this.marketerRegisterForm.get('firstName')?.value || '',
            Status: 'active',
            Region: 'Upper Egypt',
            Role: 'Marketer',
            CreatedAt: new Date().toISOString().split('T')[0],
            Password: this.marketerRegisterForm.get('password')?.value || '',
            ProfilePicturePath: profilePicturePath,
            Description: this.marketerRegisterForm.get('companyDescription')?.value || '',
            PhoneNumber: this.marketerRegisterForm.get('phone')?.value || '',
            CompanyName: this.marketerRegisterForm.get('companyName')?.value || '',
            Companywebsite: this.marketerRegisterForm.get('companyWebsite')?.value || '',
            UserIDPath: userIDPath,
            AcceptTerms: this.marketerRegisterForm.get('termsAccepted')?.value === true,
            UserType: 1 // 1 for Marketer, 0 for Customer
          };

          console.log('Submitting marketer registration data');

          // Call the registration service
          this.userService.registerMarketer(marketerData).subscribe({
            next: (response: { token: string, user?: any }) => {
              console.log('Registration successful:', response);
              this.isLoading = false;
              
              // Store user data in localStorage for persistence
              if (response.token) {
                localStorage.setItem('token', response.token);
                
                // Store user details if available
                if (response.user) {
                  localStorage.setItem('currentUser', JSON.stringify(response.user));
                } else {
                  // Create a basic user object if not returned from API
                  const userObj = {
                    firstName: marketerData.FirstName,
                    lastName: marketerData.LastName,
                    email: marketerData.Email,
                    userType: 'Marketer',
                    profilePicturePath: marketerData.ProfilePicturePath
                  };
                  localStorage.setItem('currentUser', JSON.stringify(userObj));
                }
              }
              
              // Show success message
              this.showSuccessMessage = true;
              this.successMessage = 'Registration successful! You will be redirected to the dashboard in a moment.';
              
              // Navigate to dashboard after a short delay
              setTimeout(() => {
                this.router.navigate(['/dashboard']);
              }, 3000);
            },
            error: (error: { message?: string, error?: any, status?: number }) => {
              console.error('Registration failed:', error);
              this.isLoading = false;

              // Handle different types of errors
              let errorMessage = 'Registration failed. ';
              
              // Log the raw error response for debugging
              console.log('Raw error response:', error);
              
              // Try to parse the response text if available
              if (error.error && error.error.text) {
                try {
                  const errorBody = JSON.parse(error.error.text);
                  console.log('Parsed error body:', errorBody);
                } catch (e) {
                  console.log('Could not parse error text:', error.error.text);
                }
              }

              if (error.error) {
                if (typeof error.error === 'string') {
                  errorMessage += error.error;
                } else if (error.error.message) {
                  errorMessage += error.error.message;
                } else if (error.error.errors) {
                  // Handle validation errors
                  const validationErrors = error.error.errors;
                  const errorMessages = Object.keys(validationErrors)
                    .map(key => {
                      const fieldName = this.getFieldDisplayName(key);
                      return `${fieldName}: ${validationErrors[key].join(', ')}`;
                    })
                    .join('\n');
                  errorMessage += '\n' + errorMessages;
                } else if (error.error.title) {
                  errorMessage += error.error.title;
                }
              } else if (error.status === 0) {
                errorMessage += 'Unable to connect to the server. Please check your internet connection and try again.';
              } else if (error.status === 400) {
                // Provide more specific guidance for common 400 errors
                if (birthDateString && new Date(birthDateString) > new Date(new Date().setFullYear(new Date().getFullYear() - 18))) {
                  errorMessage += 'You must be at least 18 years old to register as a marketer. Please check your birth date.';
                } else {
                  errorMessage += 'Invalid data provided. Common issues include:\n' +
                    '- Email address already in use\n' +
                    '- Username already taken\n' +
                    '- Missing required fields\n' +
                    '- Password does not meet complexity requirements';
                }
              } else if (error.status === 401) {
                errorMessage += 'Unauthorized access. Please try again.';
              } else if (error.status === 403) {
                errorMessage += 'Access forbidden. Please try again.';
              } else if (error.status === 404) {
                errorMessage += 'Registration service not found. Please try again later.';
              } else if (error.status === 409) {
                errorMessage += 'Email already exists. Please use a different email address.';
              } else if (error.status === 500) {
                errorMessage += 'Server error. Please try again later.';
              } else {
                errorMessage += 'An unexpected error occurred. Please try again.';
              }

              // Show error message to user
              alert(errorMessage);
            }
          });
        })
        .catch(error => {
          console.error('Error during file upload:', error);
          this.isLoading = false;
          let errorMessage = 'Error uploading files. ';

          if (error.error) {
            if (typeof error.error === 'string') {
              errorMessage += error.error;
            } else if (error.error.message) {
              errorMessage += error.error.message;
            } else if (error.error.errors) {
              const validationErrors = error.error.errors;
              errorMessage += Object.values(validationErrors).flat().join('\n');
            }
          } else if (error.status === 0) {
            errorMessage += 'Unable to connect to the server. Please check your internet connection.';
          } else if (error.status === 413) {
            errorMessage += 'File size is too large. Please choose a smaller file.';
          } else if (error.status === 415) {
            errorMessage += 'File type not supported. Please upload a valid image file.';
          } else {
            errorMessage += 'Please try again.';
          }

          alert(errorMessage);
        });
    } else {
      this.marketerRegisterForm.markAllAsTouched();
      const formErrors = this.getFormValidationErrors();
      if (formErrors.length > 0) {
        alert('Please fix the following errors:\n' + formErrors.join('\n'));
      } else {
        alert('Please check your form for any errors.');
      }
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
