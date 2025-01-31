import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../navbar/navbar.component";

@Component({
  selector: 'app-mainchat',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './mainchat.component.html',
  styleUrl: './mainchat.component.scss'
})
export class MainchatComponent {



  // الرسائل الحالية
  messages: { text: string, time: string }[] = [
    { text: 'Hello!', time: '12:19' },
    { text: 'How are you?', time: '12:20' }
  ];



  users = [
    { id: 1, name: 'Markter 1', image: '/images/img1.png', lastMessage: this.messages[this.messages.length-1].text, time: '10:56', unread: false },
    { id: 2, name: 'Markter 2', image: '/images/img2.png', lastMessage: 'hi asmaa, how are you', time: '09:25', unread: true },
    { id: 3, name: 'Markter 3', image: '/images/img3.png', lastMessage: 'hello asmaa', time: '02:00', unread: true },
    // يمكنك إضافة المزيد من المستخدمين هنا
  ];
  // متغيرات لإدارة المرفقات
  isMenuVisible = false;
  showEmojiPicker = false;
  emojis = ['😀', '😎', '❤️', '🔥', '👍']; // قائمة بالرموز التعبيرية

  // دالة لإرسال الرسالة
  sendMessage(message: string): void {
    if (message.trim()) {
      this.messages.push({ text: message, time: new Date().toLocaleTimeString() });
    }
  }

  // دالة لإظهار/إخفاء قائمة المرفقات
  toggleAttachmentMenu(): void {
    this.isMenuVisible = !this.isMenuVisible;
  }

  // دالة لإظهار/إخفاء محدد الرموز التعبيرية
  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  // دالة لإضافة رمز تعبيري إلى حقل الإدخال
  addEmoji(emoji: string, input: HTMLInputElement): void {
    input.value += emoji;
    this.showEmojiPicker = false;
  }

  // دوال لإدارة المرفقات (يمكنك تنفيذها حسب الحاجة)
  attachDocument(): void {
    alert('Attach Document');
  }

  openCamera(): void {
    alert('Open Camera');
  }

  attachGallery(): void {
    alert('Attach Gallery');
  }

  attachAudio(): void {
    alert('Attach Audio');
  }

  attachLocation(): void {
    alert('Attach Location');
  }

  attachContact(): void {
    alert('Attach Contact');
  }

  createPoll(): void {
    alert('Create Poll');
  }
}
