// src/app/components/signup-marketer/signup-marketer.component.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SignupMarketerComponent } from './signup-marketer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../../services/User.service';
import { of, throwError } from 'rxjs';

describe('SignupMarketerComponent', () => {
  let component: SignupMarketerComponent;
  let fixture: ComponentFixture<SignupMarketerComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['registerMarketer']);

    await TestBed.configureTestingModule({
      imports: [SignupMarketerComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [{ provide: UserService, useValue: userServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupMarketerComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit form successfully when valid', fakeAsync(() => {
    // Mock response must match RegistrationResponse
    userService.registerMarketer.and.returnValue(of({ success: true, message: 'Marketer registered successfully' }));

    component.marketerRegisterForm.patchValue({
      email: 'marketer@example.com',
      password: 'password123',
      // Add other required fields as per your form
    });

    fixture.detectChanges();
    component.onSubmit();
    tick();

    expect(userService.registerMarketer).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  }));

  it('should handle registration error', fakeAsync(() => {
    userService.registerMarketer.and.returnValue(throwError(() => ({ status: 400, message: 'Registration failed' })));

    component.marketerRegisterForm.patchValue({
      email: 'marketer@example.com',
      password: 'password123',
    });

    fixture.detectChanges();
    component.onSubmit();
    tick();

    expect(userService.registerMarketer).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    // Add expectation for error handling if applicable, e.g., alert or error message
  }));
});