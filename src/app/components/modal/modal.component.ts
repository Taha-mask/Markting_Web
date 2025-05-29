import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { PostService } from '../../services/post.service';
import { Post } from '../../interfaces/post';
import * as bootstrap from 'bootstrap';
import { User } from '../../interfaces/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

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

interface Category {
  name: string;
  icon: string;
  subcategories?: string[];
}

@Component({
    selector: 'app-modal',
    imports: [CommonModule, FormsModule, PickerComponent],
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css']
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

  constructor(private postService: PostService, private router: Router, private authService: AuthService) {}

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
      // Generate a unique ID for the post
      const uniqueId = Date.now();
      console.log('Creating new post with ID:', uniqueId);
      
      // Get the current user from auth service
      const currentUser = this.authService.getCurrentUser();
      
      // Create a complete post object with all required properties
      const post: Post = {
        id: uniqueId.toString(), // Convert number to string
        username: currentUser?.username || this.users[0].username,
        profileImageUrl: currentUser?.profileImageUrl || this.users[0].profileImageUrl,
        timestamp: new Date(),
        content: postContent,
        category: this.selectedCategory,
        subCategory: this.selectedSubcategory,
        audience: this.selectedAudience,
        media: this.mediaItems.map(item => ({
          type: item.type,
          url: item.url,
          name: item.name,
          size: item.size,
          thumbnailUrl: item.thumbnailUrl
        })),
        images: this.mediaItems.filter(item => item.type === 'image').map(item => item.url),
        currentImageIndex: 0,
        price: this.postPrice === null ? undefined : this.postPrice,
        likes: 0,
        Shares: 0,
        Saves: 0,
        showComments: false,
        isEditing: false,
        liked: false,
        saved: false,
        isFollowing: false,
        comments: [],
        reactions: {},
        topReactions: []
      };

      // Add the post to the service using the API
      this.postService.createPost(post).subscribe({
        next: (createdPost) => {
          console.log('Post created successfully:', createdPost);
          
          // Clear the form and close the modal
          this.clearForm();
          this.closeModal();
          
          // Navigate to the feed page after adding the post
          this.router.navigate(['/feed']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error creating post:', error);
          
          if (error.status === 401) {
            alert('You need to be logged in to create a post. Please sign in and try again.');
          } else if (error.status === 500) {
            // The post was likely added to the local feed due to our fallback mechanism
            console.log('Using local fallback for post creation');
            this.clearForm();
            this.closeModal();
            this.router.navigate(['/feed']);
          } else {
            alert(`Error creating post: ${error.message || 'Unknown error'}`);
            // Still close the modal and clear the form since the post was added locally
            this.clearForm();
            this.closeModal();
            this.router.navigate(['/feed']);
          }
        }
      });
    }
  }

  closeModal() {
    // First, manually remove all modal-related elements and classes
    const modalBackdrops = document.querySelectorAll('.modal-backdrop');
    modalBackdrops.forEach(backdrop => {
      backdrop.remove();
    });
    
    // Remove all modal-open classes and inline styles from body
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    
    // Then close the modal through Bootstrap API
    const modalElement = this.postModal.nativeElement;
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
    
    // Additional cleanup to ensure no opacity remains
    setTimeout(() => {
      // Double-check for any remaining backdrops
      const remainingBackdrops = document.querySelectorAll('.modal-backdrop');
      remainingBackdrops.forEach(backdrop => {
        backdrop.remove();
      });
      
      // Ensure body is fully reset
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      // Reset any inline opacity styles that might have been added
      document.body.style.opacity = '';
    }, 300);
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
    const thumbnailClass = this.getDocumentThumbnail(file.name);
    this.mediaItems.push({
      type: 'document',
      url: url,
      name: file.name,
      size: file.size,
      thumbnailUrl: thumbnailClass
    });
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
}
