import { Component, ViewChild, ElementRef, HostListener, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../navbar/navbar.component";
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mainchat',
  standalone: true,
  imports: [CommonModule, PickerModule, FormsModule],
  templateUrl: './mainchat.component.html',
  styleUrls: ['./mainchat.component.scss']
})
export class MainchatComponent implements AfterViewChecked {
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatbox.nativeElement.scrollTop = this.chatbox.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll to bottom failed', err);
    }
  }
  @ViewChild('chatbox') private chatbox!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  messages: { text: string, timestamp: Date, image?: string }[] = []; // قائمة الرسائل
  chatList: any[] = [ // قائمة المحادثات
    { id: 1, name: 'Markter 1', lastMessage: 'okay', time: '10:56', unread: false, image: '/images/img1.png' },
    { id: 2, name: 'Markter 2', lastMessage: 'hi asmaa , how are you', time: '09:25', unread: true, image: '/images/img2.png' },
    { id: 3, name: 'Markter 3', lastMessage: 'hello asmaa', time: '02:00', unread: true, image: '/images/img3.png' },
    { id: 4, name: 'Markter 4', lastMessage: 'ok asmaa thank you', time: '06:20', unread: false, image: '/images/img10.png' },
    { id: 5, name: 'Markter 5', lastMessage: 'send the project', time: '12:28', unread: false, image: '/images/img9.png' },
    { id: 6, name: 'Markter 6', lastMessage: 'happy birthday asmaa i wish you a year full of happiness and success', time: '11:17', unread: false, image: '/images/img4.png' },
    { id: 7, name: 'Markter 7', lastMessage: 'okay', time: '07:12', unread: false, image: '/images/img5.png' },
    { id: 8, name: 'Markter 8', lastMessage: 'please noooooo', time: 'yesterday', unread: true, image: '/images/img6.png' },
    { id: 9, name: 'Markter 9', lastMessage: 'hello my sister how are you', time: 'yesterday', unread: false, image: '/images/img7.png' },
    { id: 10, name: 'Markter 10', lastMessage: 'whare are you asmaa', time: 'Mondey', unread: false, image: '/images/img8.png' }
  ];

  selectedChat: any = this.chatList[0]; // المحادثة المحددة

  // إرسال رسالة جديدة
  sendMessage(message: string): void {
    if (message.trim()) {
      this.messages.push({ text: message.trim(), timestamp: new Date() });
      this.scrollToBottom();
    }
  }

  showEmojiPicker: boolean = false; // عرض/إخفاء منتقي الإيموجي

  // تبديل عرض منتقي الإيموجي
  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  // إضافة إيموجي إلى حقل الإدخال
  addEmoji(event: any) {
    const emoji = event.emoji.native;
    const searchBar = this.searchBar.nativeElement;
    searchBar.value += emoji;
    this.showEmojiPicker = false;
  }

  @ViewChild('searchBar') searchBar!: ElementRef;

  isMenuVisible = false; // عرض/إخفاء قائمة المرفقات

  // تبديل عرض قائمة المرفقات
  toggleAttachmentMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

  // تحديد محادثة
  selectChat(chat: any) {
    this.selectedChat = chat;
  }

  // وظائف المرفقات
  attachDocument() {
    console.log('Attach Document');
  }

  openCamera() {
    console.log('Open Camera');
  }

  attachGallery() {
    this.triggerFileInput();
  }

  attachAudio() {
    console.log('Attach Audio');
  }

  attachLocation() {
    console.log('Attach Location');
  }

  attachContact() {
    console.log('Attach Contact');
  }

  createPoll() {
    console.log('Create Poll');
  }

  // Trigger file input click
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  // Handle file selection
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target ? (e.target as FileReader).result as string : '';
        this.messages.push({ text: '', timestamp: new Date(), image: imageUrl });
        this.scrollToBottom();
      };
      reader.readAsDataURL(file);
    }
  }

  // إغلاق منتقي الإيموجي عند النقر خارجها
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.emoji-picker') && !target.closest('.emoji-icon')) {
      this.showEmojiPicker = false;
    }
  }
}
