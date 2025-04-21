import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { PostService } from '../services/post.service';
import { Post } from '../../interfaces/post';
import * as bootstrap from 'bootstrap';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, PickerComponent],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {
  @ViewChild('postModal') postModal!: ElementRef;
  @ViewChild('postTextarea') postTextarea!: ElementRef;
  @ViewChild('categorySelect') categorySelect!: ElementRef;
  @ViewChild('subCategorySelect') subCategorySelect!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  previewUrls: string[] = [];
  currentIndex: number = 0;
  selectedAudience: string = 'public';
  selectedAudienceText: string = 'Select audience';
  showEmojiPicker: boolean = false;
  categories = [
    { name: 'All', icon: 'bi bi-collection' },
    { name: 'Electronics', icon: 'bi bi-laptop' },
    { name: 'Food', icon: 'bi bi-egg-fried' },
    { name: 'Medicines', icon: 'bi bi-capsule' },
    { name: 'Clothing', icon: 'bi bi-person' },
    { name: 'Fashion', icon: 'bi bi-handbag' },
    { name: 'Home & Kitchen', icon: 'bi bi-house-door' },
    { name: 'Beauty & Personal Care', icon: 'bi bi-scissors' },
    { name: 'Sports & Fitness', icon: 'bi bi-bicycle' },
    { name: 'Books & Media', icon: 'bi bi-book' }
  ];

  subCategories: { [key: string]: string[] } = {
    'Electronics': ['All', 'Phones', 'Laptops', 'Tablets', 'Accessories'],
    'Food': ['All', 'Restaurants', 'Recipes', 'Groceries', 'Delivery'],
    'Medicines': ['All', 'Prescription', 'Over-the-counter', 'Supplements'],
    'Clothing': ['All', 'Men', 'Women', 'Kids', 'Accessories'],
    'Fashion': ['All', 'Trends', 'Accessories', 'Shoes', 'Bags'],
    'Home & Kitchen': ['All', 'Appliances', 'Furniture', 'Decor', 'Cookware'],
    'Beauty & Personal Care': ['All', 'Skincare', 'Makeup', 'Hair Care', 'Fragrance'],
    'Sports & Fitness': ['All', 'Equipment', 'Apparel', 'Supplements', 'Training'],
    'Books & Media': ['All', 'Books', 'Movies', 'Music', 'Games']
  };

  selectedCategory: string = '';
  selectedSubCategory: string = '';
  audienceOptions = [
    { value: 'public', label: 'Public', icon: 'bi-globe', description: 'Anyone can see this post' },
    { value: 'followers', label: 'Followers', icon: 'bi-people-fill', description: 'Only your followers can see this post' },
    { value: 'friends', label: 'Friends', icon: 'bi-people', description: 'Only your friends can see this post' },
    { value: 'close-friends', label: 'Close Friends', icon: 'bi-star-fill', description: 'Only your close friends can see this post' },
    { value: 'private', label: 'Only Me', icon: 'bi-lock-fill', description: 'Only you can see this post' }
  ];
  users = [
    { username: 'Taha Mahmoud', profileImageUrl: 'images/user-1.png' },
  ];

  constructor(private postService: PostService) {}

  ngOnInit(): void {
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.target.value;
    this.selectedSubCategory = '';
  }

  getSubCategories(): string[] {
    return this.subCategories[this.selectedCategory] || [];
  }

  async addPost() {
    const postContent = this.postTextarea.nativeElement.value;
    const postImages = this.previewUrls;

    if (!this.selectedCategory || !this.selectedSubCategory) {
      alert('Please select both category and subcategory before posting.');
      return;
    }

    if (postContent.trim() || this.previewUrls.length > 0) {
      const newPost = {
        username: this.users[0].username,
        profileImageUrl: this.users[0].profileImageUrl,
        timestamp: new Date(),
        content: postContent,
        category: this.selectedCategory,
        subCategory: this.selectedSubCategory,
        audience: this.selectedAudience,
        images: postImages,
        currentImageIndex: 0,
        likes: 0,
        Shares: 0,
        Saves: 0,
        showComments: false,
        isEditing: false,
        liked: false,
        saved: false,
        isFollowing: false,
        comments: []
      };

      this.postService.addPost(newPost);
      this.clearForm();

      this.closeModal(); // إغلاق المودال بعد إضافة البوست
    }
  }

  closeModal() {
    const modalElement = this.postModal.nativeElement;
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }

  clearForm() {
    this.postTextarea.nativeElement.value = '';
    this.previewUrls = [];
    this.selectedCategory = '';
    this.selectedSubCategory = '';
    this.selectedAudience = 'public';
    this.showEmojiPicker = false;
  }

  // دالة لتمكين السحب والإفلات
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  // دالة معالجة إفلات الملف
  onDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.readFile(file);
      }
    }
  }

  // File handling methods
  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.readFile(files[i]);
      }
    }
  }

  readFile(file: File) {
    if (!file.type.startsWith('image/')) {
      console.error('Only image files are supported');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewUrls.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  // Image navigation methods
  prevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  nextImage() {
    if (this.currentIndex < this.previewUrls.length - 1) {
      this.currentIndex++;
    }
  }

  // File input trigger
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  // دالة لحذف الصورة الحالية
  deleteImage(): void {
    if (this.previewUrls.length > 0) {
      this.previewUrls.splice(this.currentIndex, 1); // حذف الصورة الحالية

      // تحديث الفهرس الحالي بعد الحذف
      if (this.currentIndex >= this.previewUrls.length) {
        this.currentIndex = this.previewUrls.length - 1;
      }

      // إذا لم تبقَ صور، إعادة تعيين الفهرس
      if (this.previewUrls.length === 0) {
        this.currentIndex = 0;
      }
    }
  }

  // دالة لإظهار/إخفاء منتقي الإيموجيات
  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
    console.log('Emoji Picker Visibility:', this.showEmojiPicker); // للتحقق من تغيير الحالة
  }

  // دالة لإضافة الإيموجي إلى الـ textarea
  addEmoji(event: any): void {
    const textarea = this.postTextarea.nativeElement;
    const emoji = event.emoji.native; // الحصول على الإيموجي من الحدث
    textarea.value += emoji;
  }

  // دالة لتحديد الجمهور
  selectAudience(audience: string): void {
    this.selectedAudience = audience;
  }

  // دالة لحفظ الجمهور المحدد وتحديث النص
  saveAudience(): void {
    const audienceMap = {
      public: 'Public',
      followers: 'Followers',
      friends: 'Friends',
      'close-friends': 'Close Friends',
      private: 'Only Me',
    };
    this.selectedAudienceText =
      audienceMap[this.selectedAudience as keyof typeof audienceMap];
  }

  getAudienceIcon(): string {
    const option = this.audienceOptions.find(opt => opt.value === this.selectedAudience);
    return 'bi ' + (option?.icon || 'bi-globe');
  }

  setAudience(value: string): void {
    this.selectedAudience = value;
  }

  // دالة لتعقب المستخدمين بواسطة اسم المستخدم
  trackByUsername(index: number, user: any): string {
    return user.username;
  }
}
