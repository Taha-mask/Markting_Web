// src/app/components/login-form/login-form.component.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginFormComponent } from './login-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../services/User.service';
import { of, throwError } from 'rxjs';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['login']);

    await TestBed.configureTestingModule({
      imports: [LoginFormComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [{ provide: UserService, useValue: userServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with email, password, and rememberMe controls', () => {
    expect(component.loginForm.contains('email')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
    expect(component.loginForm.contains('rememberMe')).toBeTrue();
  });

  it('should mark form as invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTrue();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeFalse();
  });

  it('should submit form successfully when valid', fakeAsync(() => {
    userService.login.and.returnValue(of({ token: 'mock-token' }));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
      rememberMe: true,
    });

    fixture.detectChanges();
    component.onSubmit();
    tick();

    expect(userService.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(component.isLoading).toBeFalse();
    expect(localStorage.getItem('rememberedEmail')).toBe('test@example.com');
  }));

  it('should handle login error', fakeAsync(() => {
    userService.login.and.returnValue(throwError(() => ({ status: 401, message: 'Unauthorized' })));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'wrongpassword',
      rememberMe: false,
    });

    fixture.detectChanges();
    component.onSubmit();
    tick();

    expect(userService.login).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
    expect(component.isLoading).toBeFalse();
    expect(component.loginError).toBe('Unauthorized');
  }));

  it('should load remembered email on init', () => {
    localStorage.setItem('rememberedEmail', 'remembered@example.com');
    component.ngOnInit();
    expect(component.loginForm.get('email')?.value).toBe('remembered@example.com');
    expect(component.loginForm.get('rememberMe')?.value).toBeTrue();
    localStorage.clear();
  });

  it('should not submit if form is invalid', () => {
    spyOn(component.loginForm, 'markAllAsTouched');
    component.onSubmit();
    expect(component.loginForm.markAllAsTouched).toHaveBeenCalled();
    expect(userService.login).not.toHaveBeenCalled();
  });
});