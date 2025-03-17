import { Component, ViewChild, ElementRef, HostListener, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { FormsModule } from '@angular/forms';
import { HighlightPipe } from '../../pipes/highlight.pipe';

interface Message {
  text: string;
  timestamp: Date;
  image?: string;
  sender?: string;
  reactions?: string[];
  replyTo?: {
    text: string;
    sender: string;
  };
}

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, PickerModule, FormsModule, HighlightPipe],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements AfterViewChecked {
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

  chatList: any[] = [ // قائمة المحادثات
    { id: 1, name: 'Markter 1', lastMessage: 'okay', time: '10:56', unread: false, image: '/images/img1.png', status: 'online', messages: [
      { text: 'Hi there!', timestamp: new Date(), sender: 'other', reactions: [] },
      { text: 'Hello! How can I help you today?', timestamp: new Date(), sender: 'me', reactions: [] },
      { text: 'okay', timestamp: new Date(), sender: 'other', reactions: [] }
    ]},
    { id: 2, name: 'Markter 2', lastMessage: 'hi asmaa , how are you', time: '09:25', unread: true, image: '/images/img2.png', status: 'offline', messages: [
      { text: 'hi asmaa', timestamp: new Date(), sender: 'other', reactions: [] },
      { text: 'how are you', timestamp: new Date(), sender: 'other', reactions: [] }
    ]},
    { id: 3, name: 'Markter 3', lastMessage: 'hello asmaa', time: '02:00', unread: true, image: '/images/img3.png', status: 'online', messages: [
      { text: 'hello asmaa', timestamp: new Date(), sender: 'other', reactions: [] }
    ]},
    { id: 4, name: 'Markter 4', lastMessage: 'ok asmaa thank you', time: '06:20', unread: false, image: '/images/img10.png', status: 'offline', messages: [
      { text: 'Can you help me with the project?', timestamp: new Date(), sender: 'other', reactions: [] },
      { text: 'Sure, I\'ll take a look at it', timestamp: new Date(), sender: 'me', reactions: [] },
      { text: 'ok asmaa thank you', timestamp: new Date(), sender: 'other', reactions: [] }
    ]},
    { id: 5, name: 'Markter 5', lastMessage: 'send the project', time: '12:28', unread: false, image: '/images/img9.png', status: 'online', messages: [
      { text: 'When will you send the project?', timestamp: new Date(), sender: 'other', reactions: [] },
      { text: 'I\'m working on it', timestamp: new Date(), sender: 'me', reactions: [] },
      { text: 'send the project', timestamp: new Date(), sender: 'other', reactions: [] }
    ]},
    { id: 6, name: 'Markter 6', lastMessage: 'happy birthday asmaa i wish you a year full of happiness and success', time: '11:17', unread: false, image: '/images/img4.png', status: 'online', messages: [
      { text: 'happy birthday asmaa', timestamp: new Date(), sender: 'other', reactions: [] },
      { text: 'i wish you a year full of happiness and success', timestamp: new Date(), sender: 'other', reactions: [] },
      { text: 'Thank you so much! 😊', timestamp: new Date(), sender: 'me', reactions: [] }
    ]},
    { id: 7, name: 'Markter 7', lastMessage: 'okay', time: '07:12', unread: false, image: '/images/img5.png', status: 'offline', messages: [
      { text: 'Can we meet tomorrow?', timestamp: new Date(), sender: 'other', reactions: [] },
      { text: 'Yes, sure!', timestamp: new Date(), sender: 'me', reactions: [] },
      { text: 'okay', timestamp: new Date(), sender: 'other', reactions: [] }
    ]},
    { id: 8, name: 'Markter 8', lastMessage: 'please noooooo', time: 'yesterday', unread: true, image: '/images/img6.png', status: 'online', messages: [
      { text: 'We need to finish this today', timestamp: new Date(), sender: 'me', reactions: [] },
      { text: 'please noooooo', timestamp: new Date(), sender: 'other', reactions: [] }
    ]},
    { id: 9, name: 'Markter 9', lastMessage: 'hello my sister how are you', time: 'yesterday', unread: false, image: '/images/img7.png', status: 'offline', messages: [
      { text: 'hello my sister', timestamp: new Date(), sender: 'other', reactions: [] },
      { text: 'how are you', timestamp: new Date(), sender: 'other', reactions: [] }
    ]},
    { id: 10, name: 'Markter 10', lastMessage: 'whare are you asmaa', time: 'Mondey', unread: false, image: '/images/img8.png', status: 'online', messages: [
      { text: 'Are you at the office?', timestamp: new Date(), sender: 'other', reactions: [] },
      { text: 'whare are you asmaa', timestamp: new Date(), sender: 'other', reactions: [] }
    ]}
  ];

  selectedChat: any = this.chatList[0]; // المحادثة المحددة
  messages: Message[] = this.chatList[0].messages; // Initialize with first chat's messages

  replyingTo: any = null;

  // Reply to message
  replyToMessage(message: any, index: number) {
    this.replyingTo = {
      text: message.text,
      sender: message.sender,
      index: index
    };
    this.searchBar.nativeElement.focus();
  }

  // Cancel reply
  cancelReply() {
    this.replyingTo = null;
  }

  // إرسال رسالة جديدة
  sendMessage(message: string): void {
    if (message.trim()) {
      const newMessage: Message = { 
        text: message.trim(), 
        timestamp: new Date(), 
        sender: 'me', 
        reactions: [],
        replyTo: this.replyingTo ? {
          text: this.replyingTo.text as string,
          sender: this.replyingTo.sender as string
        } : undefined
      };
      
      this.selectedChat.messages.push(newMessage);
      this.selectedChat.lastMessage = message.trim();
      this.selectedChat.time = 'just now';
      this.messages = this.selectedChat.messages;

      // Move current chat to top of the list
      const currentChatIndex = this.chatList.findIndex(chat => chat.id === this.selectedChat.id);
      if (currentChatIndex > 0) {
        const [currentChat] = this.chatList.splice(currentChatIndex, 1);
        this.chatList.unshift(currentChat);
      }
      
      this.scrollToBottom();
      this.replyingTo = null;
      
      // Simulate receiving a reply message
      setTimeout(() => {
        this.receiveMessage('This is a reply to your message: ' + message.trim());
      }, 1000);
    }
  }

  // Simulate receiving a message from another person
  receiveMessage(message: string): void {
    if (message.trim()) {
      const newMessage: Message = { text: message.trim(), timestamp: new Date(), sender: 'other', reactions: [] };
      this.selectedChat.messages.push(newMessage);
      this.selectedChat.lastMessage = message.trim();
      this.selectedChat.time = 'just now';
      this.messages = this.selectedChat.messages;

      // Move current chat to top of the list
      const currentChatIndex = this.chatList.findIndex(chat => chat.id === this.selectedChat.id);
      if (currentChatIndex > 0) {
        const [currentChat] = this.chatList.splice(currentChatIndex, 1);
        this.chatList.unshift(currentChat);
      }

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
    const startPos = searchBar.selectionStart;
    const endPos = searchBar.selectionEnd;
    const text = searchBar.value;
    
    // Insert emoji at cursor position
    searchBar.value = text.substring(0, startPos) + emoji + text.substring(endPos);
    
    // Move cursor after the inserted emoji
    const newPos = startPos + emoji.length;
    searchBar.setSelectionRange(newPos, newPos);
    
    // Focus back on the input
    searchBar.focus();
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
    this.messages = chat.messages;

    // Move selected chat to top if it has unread messages
    if (chat.unread) {
      const currentChatIndex = this.chatList.findIndex(c => c.id === chat.id);
      if (currentChatIndex > 0) {
        const [currentChat] = this.chatList.splice(currentChatIndex, 1);
        this.chatList.unshift(currentChat);
      }
      chat.unread = false;
    }

    this.scrollToBottom();
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
        const newMessage: Message = { text: '', timestamp: new Date(), image: imageUrl, sender: 'me', reactions: [] };
        this.selectedChat.messages.push(newMessage);
        this.selectedChat.lastMessage = 'Sent an image';
        this.selectedChat.time = 'just now';
        this.messages = this.selectedChat.messages;
        this.scrollToBottom();
      };
      reader.readAsDataURL(file);
    }
  }

  // إغلاق منتقي الإيموجي عند النقر خارجها
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.emoji-picker') && 
        !target.closest('.emoji-icon') && 
        !target.closest('emoji-mart') && 
        !target.closest('.emoji-mart')) {
      this.showEmojiPicker = false;
    }
  }

  lastScrollTop = 0;
  navVisible = true;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > this.lastScrollTop) {
      // Scroll down
      this.navVisible = false;
    } else {
      // Scroll up
      this.navVisible = true;
    }
    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
  }

  showReactionPicker = false;
  selectedMessageIndex: number | null = null;

  toggleQuickReactions(messageIndex: number, event: MouseEvent) {
    event.stopPropagation();
    if (this.selectedMessageIndex === messageIndex) {
      this.showReactionPicker = !this.showReactionPicker;
    } else {
      this.selectedMessageIndex = messageIndex;
      this.showReactionPicker = true;
    }
  }

  addReaction(messageIndex: number, reaction: string) {
    const message = this.selectedChat.messages[messageIndex];
    // If clicking the same reaction, remove it
    if (message.reactions.includes(reaction)) {
      const index = message.reactions.indexOf(reaction);
      message.reactions.splice(index, 1);
    } else {
      // Clear existing reactions and add the new one
      message.reactions = [reaction];
    }
    this.showReactionPicker = false;
    this.selectedMessageIndex = null;
  }

  @HostListener('document:click')
  closeReactionPicker() {
    this.showReactionPicker = false;
    this.selectedMessageIndex = null;
  }

  searchQuery: string = '';
  filteredChatList: any[] = [];

  constructor() {
    this.filteredChatList = this.chatList;
  }

  // دالة البحث في المحادثات
  searchChats(query: string) {
    this.searchQuery = query.toLowerCase();
    if (!this.searchQuery) {
      this.filteredChatList = this.chatList;
    } else {
      this.filteredChatList = this.chatList.filter(chat => 
        chat.name.toLowerCase().includes(this.searchQuery) ||
        chat.lastMessage.toLowerCase().includes(this.searchQuery)
      );
    }
  }
}
