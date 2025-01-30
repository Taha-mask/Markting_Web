import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-secondchat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './secondchat.component.html',
  styleUrl: './secondchat.component.scss'
})
export class SecondchatComponent {
  messages: string[] = [];

  // دالة لإرسال الرسالة
  sendMessage(message: string): void {
    // التأكد من أن الرسالة ليست فارغة أو تحتوي على مسافات فقط
    if (message.trim()) {
      this.messages.push(message.trim());
    }
  }
  showEmojiPicker: boolean = false;
  emojis:string[] = [
'😂',
'❤️',
'🤡',
'🙂',
'🥹',
'😔',
'😩',
'😤',
'😈',
'😍',
'🙂',
'💖',
'😅',
'😻',
'👏🏻',
'👍🏻',
'🌎',
'💗',


  ];

  toggleEmojiPicker(){
    this.showEmojiPicker =! this.showEmojiPicker;
  }

  addEmoji(emoji:string, searchBar:HTMLInputElement){
    searchBar.value += emoji;
    this.showEmojiPicker = false;
  }

  isMenuVisible = false;

  toggleAttachmentMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

  attachDocument() {
    console.log('Attach Document');
  }

  openCamera() {
    console.log('Open Camera');
  }

  attachGallery() {
    console.log('Attach Gallery');
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
}
