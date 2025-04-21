import { Component } from '@angular/core';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [],
  templateUrl: './support.component.html',
  styleUrl: './support.component.css'
})
export class SupportComponent {
  sendMessage(event: Event): void {
    event.preventDefault();

    const form = document.getElementById('contactForm') as HTMLFormElement;
    const alertBox = document.getElementById('alertBox') as HTMLElement;
    const messageInput = form.querySelector('textarea[name="message]') as HTMLTextAreaElement;

    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

    // Store message
    const oldMessages = JSON.parse(localStorage.getItem('supportMessages') || '[]');
    oldMessages.push(message);
    localStorage.setItem('supportMessages', JSON.stringify(oldMessages));

    alertBox.classList.add('show');
    form.reset();

    setTimeout(() => {
      alertBox.classList.remove('show');
    }, 3000);
  }

  showPreviousMessages(): void {
    const messageWindow = document.getElementById('messageWindow') as HTMLElement;
    const messages = JSON.parse(localStorage.getItem('supportMessages') || '[]');

    messageWindow.innerHTML = '';
    if (messages.length === 0) {
      messageWindow.innerHTML = '<p>No previous messages.</p>';
    } else {
      for (let i = 0; i < messages.length; i++) {
        const p = document.createElement('p');
        p.textContent = messages[i];
        messageWindow.appendChild(p);
      }
    }

    messageWindow.style.display = 'block';
  }
}