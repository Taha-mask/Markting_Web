// src/app/components/signup-marketer/signup-marketer.component.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SignupUserComponent } from './signup-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../services/User.service';
import { of, throwError } from 'rxjs';

describe('SignupUserComponent', () => {
  let component: SignupUserComponent;
  let fixture: ComponentFixture<SignupUserComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['registerUser']);

    await TestBed.configureTestingModule({
      imports: [SignupUserComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [{ provide: UserService, useValue: userServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupUserComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit form successfully when valid', fakeAsync(() => {
    // Mock response must match RegistrationResponse
    userService.registerUser.and.returnValue(of({ success: true, message: 'User registered successfully' }));

    component.userRegisterForm.patchValue({
      email: 'user@example.com',
      password: 'password123',
      // Add other required fields as per your form
    });

    fixture.detectChanges();
    component.register();
    tick();

    expect(userService.registerUser).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  }));

  it('should handle registration error', fakeAsync(() => {
    userService.registerUser.and.returnValue(throwError(() => ({ status: 400, message: 'Registration failed' })));

    component.userRegisterForm.patchValue({
      email: 'user@example.com',
      password: 'password123',
    });

    fixture.detectChanges();
    component.register();
    tick();

    expect(userService.registerUser).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    // Add expectation for error handling if applicable, e.g., alert or error message
  }));
});