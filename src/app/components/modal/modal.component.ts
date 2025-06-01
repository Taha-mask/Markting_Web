import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { PostService } from '../../services/post.service';
import { Post } from '../../interfaces/post';
import * as bootstrap from 'bootstrap';
import { User } from '../../interfaces/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SupabaseService } from '../../services/supabase.service';

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
  file?: File;
}

interface Category {
  name: string;
  icon: string;
  subcategories?: string[];
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
  categories: Category[] = [
    { name: 'Electrical Tools', icon: 'fas fa-tools', subcategories: ['Power Tools', 'Hand Tools', 'Measuring Tools'] },
    { name: 'Food', icon: 'fas fa-utensils', subcategories: ['Restaurants', 'Groceries', 'Beverages'] },
    { name: 'Medicines', icon: 'fas fa-pills', subcategories: ['Prescription', 'Over-the-counter', 'Supplements'] },
    { name: 'Electronics', icon: 'fas fa-laptop', subcategories: ['Computers', 'Phones', 'Accessories'] },
    { name: 'Clothing', icon: 'fas fa-tshirt', subcategories: ['Men', 'Women', 'Kids'] },
    { name: 'Fashion', icon: 'fas fa-shopping-bag', subcategories: ['Accessories', 'Jewelry', 'Watches'] },
    { name: 'Home & Kitchen', icon: 'fas fa-home', subcategories: ['Furniture', 'Appliances', 'Decor'] },
    { name: 'Beauty & Personal Care', icon: 'fas fa-spa', subcategories: ['Skincare', 'Makeup', 'Hair Care'] },
    { name: 'Home Appliances', icon: 'fas fa-blender', subcategories: ['Kitchen', 'Laundry', 'Cleaning'] },
    { name: 'Sports & Fitness', icon: 'fas fa-dumbbell', subcategories: ['Equipment', 'Apparel', 'Accessories'] },
    { name: 'Video Games', icon: 'fas fa-gamepad', subcategories: ['Consoles', 'Games', 'Accessories'] },
    { name: 'Toys & Hobbies', icon: 'fas fa-puzzle-piece', subcategories: ['Games', 'Collectibles', 'Crafts'] },
    { name: 'Auto Parts', icon: 'fas fa-car', subcategories: ['Interior', 'Exterior', 'Engine'] },
    { name: 'Groceries', icon: 'fas fa-shopping-basket', subcategories: ['Fresh Food', 'Pantry', 'Beverages'] },
    { name: 'Health & Personal Care', icon: 'fas fa-heartbeat', subcategories: ['Vitamins', 'Personal Care', 'Medical Supplies'] },
    { name: 'Books & Media', icon: 'fas fa-book', subcategories: ['Books', 'Movies', 'Music'] },
    { name: 'Pet Supplies', icon: 'fas fa-paw', subcategories: ['Food', 'Accessories', 'Health'] },
    { name: 'Perfumes', icon: 'fas fa-spray-can', subcategories: ['Men', 'Women', 'Unisex'] }
  ];

  selectedCategory: string = '';
  selectedSubcategory: string = '';
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

  constructor(
    private postService: PostService,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit(): void {
  }

  onCategoryChange() {
    this.selectedSubcategory = '';
  }

  getSelectedCategorySubcategories(): string[] {
    const category = this.categories.find(c => c.name === this.selectedCategory);
    return category?.subcategories || [];
  }

  async addPost() {
    const postContent = this.postTextarea.nativeElement.value;

    if (!this.selectedCategory || !this.selectedSubcategory) {
      alert('Please select both category and subcategory before posting.');
      return;
    }

    if (postContent.trim() || this.mediaItems.length > 0) {
      try {
        // Upload all media items first
        const uploadedMedia = await Promise.all(
          this.mediaItems.map(async (item) => {
            if (item.type === 'image' && item.file) {
              const imageUrl = await this.supabaseService.uploadImage(item.file, 'post-images');
              return {
                type: 'image' as const,
                url: imageUrl,
                name: item.name,
                size: item.size
              };
            }
            return item;
          })
        );

        const newPost = {
          username: this.users[0].username,
          profileImageUrl: this.users[0].profileImageUrl,
          timestamp: new Date(),
          content: postContent,
          category: this.selectedCategory,
          subCategory: this.selectedSubcategory,
          audience: this.selectedAudience,
          media: uploadedMedia,
          currentImageIndex: 0,
          images: uploadedMedia.filter(item => item.type === 'image').map(item => item.url),
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
          id: Date.now().toString(),
          ...newPost
        };

        await this.postService.addPost(post);
        this.clearForm();
        this.closeModal();
      } catch (error) {
        console.error('Error adding post:', error);
        alert('Failed to add post. Please try again.');
      }
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
    this.selectedSubcategory = '';
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

  private async handleImageFile(file: File) {
    try {
      const imageUrl = await this.supabaseService.uploadImage(file, 'post-images');
      this.mediaItems.push({
        type: 'image',
        url: imageUrl,
        name: file.name,
        size: file.size
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  private async handleVideoFile(file: File) {
    try {
      const videoUrl = await this.supabaseService.uploadVideo(file, 'post-videos');
      this.mediaItems.push({
        type: 'video',
        url: videoUrl,
        name: file.name,
        size: file.size
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  }

  private async handleDocumentFile(file: File) {
    try {
      const documentUrl = await this.supabaseService.uploadImage(file, 'post-documents');
      const thumbnailClass = this.getDocumentThumbnail(file.name);
      this.mediaItems.push({
        type: 'document',
        url: documentUrl,
        name: file.name,
        size: file.size,
        thumbnailUrl: thumbnailClass
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  private isDocumentFile(file: File): boolean {
    const documentExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'];
    return documentExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  }

  private getDocumentThumbnail(fileName: string): string {
    const ext = fileName.toLowerCase();
    if (ext.endsWith('.pdf')) {
      return 'fas fa-file-pdf text-danger fa-2x';
    } else if (ext.endsWith('.doc') || ext.endsWith('.docx')) {
      return 'fas fa-file-word text-primary fa-2x';
    } else if (ext.endsWith('.xls') || ext.endsWith('.xlsx')) {
      return 'fas fa-file-excel text-success fa-2x';
    } else if (ext.endsWith('.ppt') || ext.endsWith('.pptx')) {
      return 'fas fa-file-powerpoint text-warning fa-2x';
    }
    return 'fas fa-file-alt text-secondary fa-2x';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Image navigation methods
  prevImage(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  nextImage(): void {
    if (this.currentIndex < this.mediaItems.length - 1) {
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

  async handleImageUpload(file: File) {
    try {
      const imageUrl = await this.supabaseService.uploadImage(file);
      console.log('Image uploaded successfully:', imageUrl);
      // Use the imageUrl (e.g., save to user profile, display in UI, etc.)
    } catch (error) {
      console.error('Failed to upload image:', error);
      // Handle error (show error message to user, etc.)
    }
  }
}
