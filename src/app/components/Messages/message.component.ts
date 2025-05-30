import { Component, ViewChild, ElementRef, HostListener, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  seen?: boolean;
}

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, PickerModule, FormsModule, HighlightPipe],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements AfterViewChecked {
  filteredChatList: any[];

  constructor() {
    this.filteredChatList = this.chatList;
    // Share this component instance with window for navbar access
    (window as any).messageComponent = this;
  }

  ngOnDestroy() {
    // Clean up when component is destroyed
    delete (window as any).messageComponent;
  }

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
  @ViewChild('searchBar') searchBar!: ElementRef;





  chatList: any[] = [
    {
      id: 1,
      name: 'Markter 1',
      lastMessage: 'okay',
      time: '10:56',
      unread: false,
      image: '/images/img1.png',
      status: 'online',
      messages: [
        { text: 'Hi there!', timestamp: new Date(), sender: 'other', reactions: [], seen: true },
        { text: 'Hello! How can I help you today?', timestamp: new Date(), sender: 'me', reactions: [], seen: true },
        { text: 'okay', timestamp: new Date(), sender: 'other', reactions: [], seen: true }
      ]
    },
    {
      id: 2,
      name: 'Markter 2',
      lastMessage: 'hi asmaa , how are you',
      time: '09:25',
      unread: true,
      image: '/images/img2.png',
      status: 'offline',
      messages: [
        { text: 'hi asmaa', timestamp: new Date(), sender: 'other', reactions: [], seen: false },
        { text: 'how are you', timestamp: new Date(), sender: 'other', reactions: [], seen: false }
      ]
    },
    {
      id: 3,
      name: 'Markter 3',
      lastMessage: 'hello asmaa',
      time: '02:00',
      unread: true,
      image: '/images/img3.png',
      status: 'online',
      messages: [
        { text: 'hello asmaa', timestamp: new Date(), sender: 'other', reactions: [], seen: false }
      ]
    },
    {
      id: 4,
      name: 'Markter 4',
      lastMessage: 'ok asmaa thank you',
      time: '06:20',
      unread: false,
      image: '/images/img10.png',
      status: 'offline',
      messages: [
        { text: 'Can you help me with the project?', timestamp: new Date(), sender: 'other', reactions: [], seen: true },
        { text: 'Sure, I\'ll take a look at it', timestamp: new Date(), sender: 'me', reactions: [], seen: true },
        { text: 'ok asmaa thank you', timestamp: new Date(), sender: 'other', reactions: [], seen: true }
      ]
    },
    {
      id: 5,
      name: 'Markter 5',
      lastMessage: 'send the project',
      time: '12:28',
      unread: false,
      image: '/images/img9.png',
      status: 'online',
      messages: [
        { text: 'When will you send the project?', timestamp: new Date(), sender: 'other', reactions: [], seen: true },
        { text: 'I\'m working on it', timestamp: new Date(), sender: 'me', reactions: [], seen: true },
        { text: 'send the project', timestamp: new Date(), sender: 'other', reactions: [], seen: true }
      ]
    },
    {
      id: 6,
      name: 'Markter 6',
      lastMessage: 'happy birthday asmaa i wish you a year full of happiness and success',
      time: '11:17',
      unread: false,
      image: '/images/img4.png',
      status: 'online',
      messages: [
        { text: 'happy birthday asmaa', timestamp: new Date(), sender: 'other', reactions: [], seen: true },
        { text: 'i wish you a year full of happiness and success', timestamp: new Date(), sender: 'other', reactions: [], seen: true },
        { text: 'Thank you so much! 😊', timestamp: new Date(), sender: 'me', reactions: [], seen: true }
      ]
    },
    {
      id: 7,
      name: 'Markter 7',
      lastMessage: 'okay',
      time: '07:12',
      unread: false,
      image: '/images/img5.png',
      status: 'offline',
      messages: [
        { text: 'Can we meet tomorrow?', timestamp: new Date(), sender: 'other', reactions: [], seen: true },
        { text: 'Yes, sure!', timestamp: new Date(), sender: 'me', reactions: [], seen: true },
        { text: 'okay', timestamp: new Date(), sender: 'other', reactions: [], seen: true }
      ]
    },
    {
      id: 8,
      name: 'Markter 8',
      lastMessage: 'please noooooo',
      time: 'yesterday',
      unread: true,
      image: '/images/img6.png',
      status: 'online',
      messages: [
        { text: 'We need to finish this today', timestamp: new Date(), sender: 'me', reactions: [], seen: false },
        { text: 'please noooooo', timestamp: new Date(), sender: 'other', reactions: [], seen: false }
      ]
    },
    {
      id: 9,
      name: 'Markter 9',
      lastMessage: 'hello my sister how are you',
      time: 'yesterday',
      unread: false,
      image: '/images/img7.png',
      status: 'offline',
      messages: [
        { text: 'hello my sister', timestamp: new Date(), sender: 'other', reactions: [], seen: true },
        { text: 'how are you', timestamp: new Date(), sender: 'other', reactions: [], seen: true }
      ]
    },
    {
      id: 10,
      name: 'Markter 10',
      lastMessage: 'whare are you asmaa',
      time: 'Mondey',
      unread: false,
      image: '/images/img8.png',
      status: 'online',
      messages: [
        { text: 'Are you at the office?', timestamp: new Date(), sender: 'other', reactions: [], seen: true },
        { text: 'whare are you asmaa', timestamp: new Date(), sender: 'other', reactions: [], seen: true }
      ]
    }
  ];

  selectedChat: any = this.chatList[0];
  messages: Message[] = this.chatList[0].messages;
  replyingTo: any = null;

  // متغيرات جديدة للتحكم في القائمة المنسدلة (ثلاث نقاط)
  showMoreOptions: boolean = false;
  selectedMoreOptionsIndex: number | null = null;

  replyToMessage(message: any, index: number) {
    this.replyingTo = {
      text: message.text,
      sender: message.sender,
      index: index
    };
    this.searchBar.nativeElement.focus();
  }

  cancelReply() {
    this.replyingTo = null;
  }

  sendMessage(message: string): void {
    if (message.trim()) {
      const newMessage: Message = {
        text: message.trim(),
        timestamp: new Date(),
        sender: 'me',
        reactions: [],
        seen: false,
        replyTo: this.replyingTo ? {
          text: this.replyingTo.text as string,
          sender: this.replyingTo.sender as string
        } : undefined
      };

      this.selectedChat.messages.push(newMessage);
      this.selectedChat.lastMessage = message.trim();
      this.selectedChat.time = 'just now';
      this.messages = this.selectedChat.messages;

      const currentChatIndex = this.chatList.findIndex(chat => chat.id === this.selectedChat.id);
      if (currentChatIndex > 0) {
        const [currentChat] = this.chatList.splice(currentChatIndex, 1);
        this.chatList.unshift(currentChat);
      }

      this.scrollToBottom();
      this.replyingTo = null;

      setTimeout(() => {
        this.receiveMessage('This is a reply to your message: ' + message.trim());
      }, 1000);
    }
  }

  receiveMessage(message: string): void {
    if (message.trim()) {
      const newMessage: Message = {
        text: message.trim(),
        timestamp: new Date(),
        sender: 'other',
        reactions: [],
        seen: true
      };
      this.selectedChat.messages.push(newMessage);
      this.selectedChat.lastMessage = message.trim();
      this.selectedChat.time = 'just now';
      this.messages = this.selectedChat.messages;

      const currentChatIndex = this.chatList.findIndex(chat => chat.id === this.selectedChat.id);
      if (currentChatIndex > 0) {
        const [currentChat] = this.chatList.splice(currentChatIndex, 1);
        this.chatList.unshift(currentChat);
      }

      this.scrollToBottom();
    }
  }

  showEmojiPicker: boolean = false;

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    const emoji = event.emoji.native;
    const searchBar = this.searchBar.nativeElement;
    const startPos = searchBar.selectionStart;
    const endPos = searchBar.selectionEnd;
    const text = searchBar.value;

    searchBar.value = text.substring(0, startPos) + emoji + text.substring(endPos);
    const newPos = startPos + emoji.length;
    searchBar.setSelectionRange(newPos, newPos);
    searchBar.focus();
  }

  isMenuVisible = false;

  toggleAttachmentMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

  isChatSelected: boolean = false; // متغير جديد لتتبع حالة اختيار الدردشة

  selectChat(chat: any) {
    this.selectedChat = chat;
    this.messages = chat.messages;
    this.isChatSelected = true; // Set to true when entering a chat

    this.messages.forEach((message: Message) => {
      if (message.sender === 'other') {
        message.seen = true;
      }
    });

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

  goBackToChatList() {
    this.isChatSelected = false; // Set to false when returning to chat list
  }

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

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target ? (e.target as FileReader).result as string : '';
        const newMessage: Message = {
          text: '',
          timestamp: new Date(),
          image: imageUrl,
          sender: 'me',
          reactions: [],
          seen: false
        };
        this.selectedChat.messages.push(newMessage);
        this.selectedChat.lastMessage = 'Sent an image';
        this.selectedChat.time = 'just now';
        this.messages = this.selectedChat.messages;
        this.scrollToBottom();
      };
      reader.readAsDataURL(file);
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.emoji-picker') &&
        !target.closest('.emoji-icon') &&
        !target.closest('emoji-mart') &&
        !target.closest('.emoji-mart')) {
      this.showEmojiPicker = false;
    }
    // إغلاق القائمة المنسدلة عند النقر خارجها
    if (!target.closest('.more-options-btn') && !target.closest('.more-options-menu')) {
      this.showMoreOptions = false;
      this.selectedMoreOptionsIndex = null;
    }
  }

  lastScrollTop = 0;
  navVisible = true;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > this.lastScrollTop) {
      this.navVisible = false;
    } else {
      this.navVisible = true;
    }
    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
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
    if (message.reactions.includes(reaction)) {
      const index = message.reactions.indexOf(reaction);
      message.reactions.splice(index, 1);
    } else {
      message.reactions = [reaction];
    }
    this.showReactionPicker = false;
    this.selectedMessageIndex = null;
  }

  // دالة لتبديل القائمة المنسدلة (ثلاث نقاط)
  toggleMoreOptions(messageIndex: number, event: MouseEvent) {
    event.stopPropagation();
    if (this.selectedMoreOptionsIndex === messageIndex) {
      this.showMoreOptions = !this.showMoreOptions;
    } else {
      this.selectedMoreOptionsIndex = messageIndex;
      this.showMoreOptions = true;
    }
  }

  // دوال لخيارات القائمة المنسدلة
  forwardMessage(message: Message) {
    console.log('Forward message:', message.text);
    this.showMoreOptions = false;
    this.selectedMoreOptionsIndex = null;
  }

  copyMessage(message: Message) {
    navigator.clipboard.writeText(message.text);
    console.log('Message copied:', message.text);
    this.showMoreOptions = false;
    this.selectedMoreOptionsIndex = null;
  }

  unsendMessage(messageIndex: number) {
    this.selectedChat.messages.splice(messageIndex, 1);
    this.messages = this.selectedChat.messages;
    this.showMoreOptions = false;
    this.selectedMoreOptionsIndex = null;
  }

  @HostListener('document:click')
  closeReactionPicker() {
    this.showReactionPicker = false;
    this.selectedMessageIndex = null;
  }

  searchQuery: string = '';

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