import { Component } from '@angular/core';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [],
  templateUrl: './support.component.html',
  styleUrl: './support.component.css'
})
export class SupportComponent {
  onSubmit(event: Event): void {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    if (name && email && message) {
      const alertBox = document.getElementById('messageAlert');
      if (alertBox) {
        alertBox.classList.add('show');

        // Hide after 3 seconds
        setTimeout(() => {
          alertBox.classList.remove('show');
        }, 3000);
      }

      // Reset form
      form.reset();
    }
  }
}