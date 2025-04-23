import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { PostService } from '../services/post.service';
import { Post } from '../../interfaces/post';
import * as bootstrap from 'bootstrap';
import { User } from '../../interfaces/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

interface ImagePreview {
  file: File;
  preview: string;
}

interface MediaItem {
  type: 'image' | 'video' | 'document';
  url: string;
  name?: string;
  size?: number;
  thumbnailUrl?: string;
}

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
    { name: 'Electrical Tools', icon: 'bi bi-tools' },
    { name: 'Food', icon: 'bi bi-egg-fried' },
    { name: 'Medicines', icon: 'bi bi-capsule' },
    { name: 'Electronics', icon: 'bi bi-laptop' },
    { name: 'Clothing', icon: 'bi bi-person' },
    { name: 'Fashion', icon: 'bi bi-handbag' },
    { name: 'Home & Kitchen', icon: 'bi bi-house-door' },
    { name: 'Beauty & Personal Care', icon: 'bi bi-scissors' },
    { name: 'Home Appliances', icon: 'bi bi-fan' },
    { name: 'Sports & Fitness', icon: 'bi bi-bicycle' },
    { name: 'Video Games', icon: 'bi bi-controller' },
    { name: 'Toys & Hobbies', icon: 'bi bi-joystick' },
    { name: 'Auto Parts', icon: 'bi bi-car-front' },
    { name: 'Groceries', icon: 'bi bi-cart' },
    { name: 'Health & Personal Care', icon: 'bi bi-heart-pulse' },
    { name: 'Books & Media', icon: 'bi bi-book' },
    { name: 'Pet Supplies', icon: 'bi bi-heart' },
    { name: 'Perfumes', icon: 'bi bi-flower1' }
  ];

  subCategories: { [key: string]: string[] } = {
    'All': ['All Categories'],
    'Electrical Tools': ['All', 'Power Tools', 'Hand Tools', 'Measuring Tools', 'Safety Equipment'],
    'Food': ['All', 'Restaurants', 'Recipes', 'Groceries', 'Delivery', 'Snacks', 'Beverages'],
    'Medicines': ['All', 'Prescription', 'Over-the-counter', 'Supplements', 'First Aid', 'Vitamins'],
    'Electronics': ['All', 'Phones', 'Laptops', 'Tablets', 'Accessories', 'Smart Home', 'Cameras'],
    'Clothing': ['All', 'Men', 'Women', 'Kids', 'Accessories', 'Sportswear', 'Formal Wear'],
    'Fashion': ['All', 'Trends', 'Accessories', 'Shoes', 'Bags', 'Jewelry', 'Watches'],
    'Home & Kitchen': ['All', 'Appliances', 'Furniture', 'Decor', 'Cookware', 'Storage', 'Lighting'],
    'Beauty & Personal Care': ['All', 'Skincare', 'Makeup', 'Hair Care', 'Fragrance', 'Bath & Body', 'Tools'],
    'Home Appliances': ['All', 'Kitchen', 'Laundry', 'Cleaning', 'Climate Control', 'Entertainment'],
    'Sports & Fitness': ['All', 'Equipment', 'Apparel', 'Supplements', 'Training', 'Outdoor', 'Team Sports'],
    'Video Games': ['All', 'Console Games', 'PC Games', 'Mobile Games', 'Accessories', 'Virtual Reality'],
    'Toys & Hobbies': ['All', 'Action Figures', 'Board Games', 'Crafts', 'Educational', 'Remote Control'],
    'Auto Parts': ['All', 'Engine Parts', 'Exterior', 'Interior', 'Accessories', 'Tools', 'Maintenance'],
    'Groceries': ['All', 'Fresh Food', 'Pantry', 'Beverages', 'Snacks', 'Organic', 'International'],
    'Health & Personal Care': ['All', 'Vitamins', 'Personal Care', 'Health Monitors', 'First Aid', 'Wellness'],
    'Books & Media': ['All', 'Books', 'Movies', 'Music', 'Games', 'Magazines', 'Educational'],
    'Pet Supplies': ['All', 'Dog Supplies', 'Cat Supplies', 'Fish Supplies', 'Bird Supplies', 'Small Pets'],
    'Perfumes': ['All', 'Women\'s Perfumes', 'Men\'s Perfumes', 'Unisex', 'Gift Sets', 'Luxury']
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
  postPrice: number | null = null;

  mediaItems: MediaItem[] = [];
  allowedDocumentTypes = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt';
  allowedVideoTypes = 'video/*';

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

    if (!this.selectedCategory || !this.selectedSubCategory) {
      alert('Please select both category and subcategory before posting.');
      return;
    }

    if (postContent.trim() || this.mediaItems.length > 0) {
      const newPost = {
        username: this.users[0].username,
        profileImageUrl: this.users[0].profileImageUrl,
        timestamp: new Date(),
        content: postContent,
        category: this.selectedCategory,
        subCategory: this.selectedSubCategory,
        audience: this.selectedAudience,
        media: this.mediaItems.map(item => ({
          type: item.type,
          url: item.url,
          name: item.name,
          size: item.size,
          thumbnailUrl: item.thumbnailUrl
        })),
        currentImageIndex: 0,
        price: this.postPrice,
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

      const post: Post = {
        id: Date.now().toString(), // Generate a temporary ID
        title: '', // Add empty title if required
        imageUrl: this.mediaItems[0]?.url || '', // Use first media URL or empty string
        author: this.users[0].username,
        date: new Date(),
        username: newPost.username,
        profileImageUrl: newPost.profileImageUrl,
        timestamp: newPost.timestamp,
        content: newPost.content,
        category: newPost.category,
        subCategory: newPost.subCategory,
        audience: newPost.audience,
        media: newPost.media,
        currentImageIndex: newPost.currentImageIndex,
        price: newPost.price,
        likes: newPost.likes,
        Shares: newPost.Shares,
        Saves: newPost.Saves,
        showComments: newPost.showComments,
        isEditing: newPost.isEditing,
        liked: newPost.liked,
        saved: newPost.saved,
        isFollowing: newPost.isFollowing,
        comments: newPost.comments
      };

      this.postService.addPost(post);
      this.clearForm();
      this.closeModal();
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
    this.postPrice = null;
    this.mediaItems.forEach(item => {
      if (item.type === 'video' || item.type === 'document') {
        URL.revokeObjectURL(item.url);
      }
    });
    this.mediaItems = [];
    this.currentIndex = 0;
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
    if (file.type.startsWith('image/')) {
      this.handleImageFile(file);
    } else if (file.type.startsWith('video/')) {
      this.handleVideoFile(file);
    } else if (this.isDocumentFile(file)) {
      this.handleDocumentFile(file);
    } else {
      console.error('Unsupported file type');
    }
  }

  private handleImageFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.mediaItems.push({
        type: 'image',
        url: e.target.result,
        name: file.name,
        size: file.size
      });
    };
    reader.readAsDataURL(file);
  }

  private handleVideoFile(file: File) {
    const url = URL.createObjectURL(file);
    this.mediaItems.push({
      type: 'video',
      url: url,
      name: file.name,
      size: file.size
    });
  }

  private handleDocumentFile(file: File) {
    const url = URL.createObjectURL(file);
    this.mediaItems.push({
      type: 'document',
      url: url,
      name: file.name,
      size: file.size,
      thumbnailUrl: this.getDocumentThumbnail(file.name)
    });
  }

  private isDocumentFile(file: File): boolean {
    const documentExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'];
    return documentExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  }

  private getDocumentThumbnail(fileName: string): string {
    if (fileName.endsWith('.pdf')) {
      return 'assets/icons/pdf-icon.png';
    } else if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
      return 'assets/icons/word-icon.png';
    } else if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
      return 'assets/icons/excel-icon.png';
    } else if (fileName.endsWith('.ppt') || fileName.endsWith('.pptx')) {
      return 'assets/icons/powerpoint-icon.png';
    }
    return 'assets/icons/document-icon.png';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  deleteCurrentItem(): void {
    if (this.mediaItems.length > 0) {
      // إذا كان العنصر فيديو أو مستند، قم بإلغاء URL
      const item = this.mediaItems[this.currentIndex];
      if (item.type === 'video' || item.type === 'document') {
        URL.revokeObjectURL(item.url);
      }
      
      this.mediaItems.splice(this.currentIndex, 1);
      if (this.currentIndex >= this.mediaItems.length) {
        this.currentIndex = this.mediaItems.length - 1;
      }
      if (this.mediaItems.length === 0) {
        this.currentIndex = 0;
      }
    }
  }
}
