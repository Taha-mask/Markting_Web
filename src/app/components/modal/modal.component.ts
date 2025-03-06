import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { PostService } from '../post.service';
import { User } from '../../user';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, PickerComponent], // Add FormsModule to imports
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  @ViewChild('postModal') postModal!: ElementRef;
  @ViewChild('postTextarea') postTextarea!: ElementRef;

  previewUrls: string[] = [];
  currentIndex: number = 0;
  selectedAudience: string = 'public';
  selectedAudienceText: string = 'Select audience';
  showEmojiPicker: boolean = false;
  selectedCategory: string = 'General'; // Add a property for the selected category

  users = [
    { username: 'Taha' },
    { username: 'Mahmoud' },
  ];

  categories = [
    { name: 'All' },
    { name: 'Electrical Tools' },
    { name: 'Food' },
    { name: 'Medicines' },
    { name: 'Electronics' },
    { name: 'Clothing' },
    { name: 'Fashion' },
    { name: 'Home & Kitchen' },
    { name: 'Beauty & Personal Care' },
    { name: 'Home Appliances' },
    { name: 'Sports & Fitness' },
    { name: 'Video Games' },
    { name: 'Toys & Hobbies' },
    { name: 'Auto Parts' },
    { name: 'Groceries' },
    { name: 'Health & Personal Care' },
    { name: 'Books & Media' },
    { name: 'Pet Supplies' },
    { name: 'Perfumes' },
  ];

  constructor(private postService: PostService) {} // حقن الـ Service

  // دالة لإضافة البوست
  createPost() {
    const postContent = this.postTextarea.nativeElement.value;
    const postImages = this.previewUrls;

    if (postContent.trim() || postImages.length > 0) {
      const newPost = {
        username: this.users[0].username + this.users[1].username, // المستخدم الحالي
        profileImageUrl: '', // صورة المستخدم
        timestamp: new Date(),
        content: postContent,
        category: this.selectedCategory, // تضمين الفئة المحددة
        images: postImages,
        currentImageIndex: 0,
        likes: 0,
        Shares: 0,
        Saves: 0,
        showComments: false,
        isEditing: false,
        liked: false,
        saved: false,
        comments: [],
      };

      this.postService.addPost(newPost); // إرسال البوست عبر الـ Service
      this.clearForm(); // تنظيف النموذج
    }
  }

  // دالة لتنظيف النموذج بعد إضافة البوست
  clearForm() {
    this.postTextarea.nativeElement.value = '';
    this.previewUrls = [];
    this.currentIndex = 0;
    this.selectedCategory = 'General'; // إعادة تعيين الفئة إلى القيمة الافتراضية
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

  // دالة معالجة اختيار الملف
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.readFile(file);
      }
    }
  }

  // دالة لقراءة الملف وعرضه
  private readFile(file: File): void {
    const reader = new FileReader();

    reader.onload = () => {
      this.previewUrls.push(reader.result as string); // إضافة الصورة إلى المصفوفة
      this.currentIndex = this.previewUrls.length - 1; // الانتقال إلى الصورة الأخيرة
    };

    reader.readAsDataURL(file);
  }

  // دالة للتنقل إلى الصورة التالية
  nextImage(): void {
    if (this.currentIndex < this.previewUrls.length - 1) {
      this.currentIndex++;
    }
  }

  // دالة للتنقل إلى الصورة السابقة
  prevImage(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
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

  // دالة لتحديد الجمهور
  selectAudience(audience: string): void {
    this.selectedAudience = audience;
  }

  // دالة لحفظ الجمهور المحدد وتحديث النص
  saveAudience(): void {
    const audienceMap = {
      public: 'Public',
      friends: 'Friends',
      onlyMe: 'Only Me',
    };
    this.selectedAudienceText =
      audienceMap[this.selectedAudience as keyof typeof audienceMap];
  }

  // دالة لتعقب المستخدمين بواسطة اسم المستخدم
  trackByUsername(index: number, user: any): string {
    return user.username;
  }
}
