import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements AfterViewInit {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  login() {
    // منطق تسجيل الدخول هنا
    this.router.navigate(['/feed']); // توجيه إلى صفحة Feed
  }
  ngAfterViewInit() {
    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#password') as HTMLInputElement;

    togglePassword?.addEventListener('click', () => {
      const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
      password.setAttribute('type', type);
      togglePassword.classList.toggle('fa-eye-slash');
    });
  }

  onSubmit() {
    // Perform login logic here (e.g., authentication)

    // Navigate to the feed page
    this.router.navigate(['/feed']);
  }
}
