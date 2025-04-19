import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { PostService } from '../services/post.service'; // Import the PostService
import { User } from '../../interfaces/user';

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
  selectedCategory: string = 'All'; // Set default category to 'All'
  selectedSubCategory: string = 'All'; // Set default subcategory to 'All'

  users = [
    { username: 'Taha Mahmoud', profileImageUrl: 'images/user-1.png' },
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

    if (!this.selectedCategory || this.selectedCategory === 'All' || this.selectedSubCategory === 'All') {
      alert('Please select a category before posting.');
      return;
    }

    if (postContent.trim() || postImages.length > 0) {
      const newPost = {
        username: this.users[0].username, // Use profile's username
        profileImageUrl: this.users[0].profileImageUrl, // Use profile's profile picture
        timestamp: new Date(),
        content: postContent,
        category: this.selectedCategory, // تضمين الفئة المحددة
        subCategory: this.selectedSubCategory, // تضمين الفئة الفرعية المحددة
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
    this.selectedCategory = 'All'; // إعادة تعيين الفئة إلى 'All'
    this.selectedSubCategory = 'All'; // إعادة تعيين الفئة الفرعية إلى 'All'
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
      const result = reader.result as string;
      if (file.type.startsWith('video/')) {
        this.previewUrls.push(result); // إضافة الفيديو إلى المصفوفة
      } else {
        this.previewUrls.push(result); // إضافة الصورة إلى المصفوفة
      }
      this.currentIndex = this.previewUrls.length - 1; // الانتقال إلى الصورة/الفيديو الأخير
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

  getSubCategories(categoryName: string): any[] {
    const subCategories = [
        { name: 'All', icon: 'bi bi-list' } // Add "All" option to each subcategory list
    ];
    switch (categoryName) {
      case 'Food':
        return subCategories.concat([
          { name: 'Drinks', icon: 'bi bi-cup' },
          { name: 'Candy', icon: 'bi bi-candy' },
          { name: 'Snacks', icon: 'bi bi-basket' },
          { name: 'Desserts', icon: 'bi bi-cake' }
        ]);
      case 'Electronics':
        return subCategories.concat([
          { name: 'Phones', icon: 'bi bi-phone' },
          { name: 'Laptops', icon: 'bi bi-laptop' },
          { name: 'Accessories', icon: 'bi bi-headphones' }
        ]);
      case 'Electrical Tools':
        return subCategories.concat([
          { name: 'Power Tools', icon: 'bi bi-lightning' },
          { name: 'Hand Tools', icon: 'bi bi-wrench' },
          { name: 'Measurement Tools', icon: 'bi bi-ruler' }
        ]);
      case 'Medicines':
        return subCategories.concat([
          { name: 'Prescription', icon: 'bi bi-file-medical' },
          { name: 'Over-the-Counter', icon: 'bi bi-capsule' },
          { name: 'Supplements', icon: 'bi bi-pills' }
        ]);
      case 'Clothing':
        return subCategories.concat([
          { name: 'Men', icon: 'bi bi-person' },
          { name: 'Women', icon: 'bi bi-person-fill' },
          { name: 'Kids', icon: 'bi bi-person-badge' }
        ]);
      case 'Fashion':
        return subCategories.concat([
          { name: 'Accessories', icon: 'bi bi-handbag' },
          { name: 'Jewelry', icon: 'bi bi-gem' },
          { name: 'Shoes', icon: 'bi bi-shoe' }
        ]);
      case 'Home & Kitchen':
        return subCategories.concat([
          { name: 'Furniture', icon: 'bi bi-house' },
          { name: 'Appliances', icon: 'bi bi-fan' },
          { name: 'Decor', icon: 'bi bi-paint-bucket' }
        ]);
      case 'Beauty & Personal Care':
        return subCategories.concat([
          { name: 'Skincare', icon: 'bi bi-droplet' },
          { name: 'Haircare', icon: 'bi bi-scissors' },
          { name: 'Makeup', icon: 'bi bi-brush' }
        ]);
      case 'Home Appliances':
        return subCategories.concat([
          { name: 'Kitchen', icon: 'bi bi-fridge' },
          { name: 'Laundry', icon: 'bi bi-washing-machine' },
          { name: 'Cleaning', icon: 'bi bi-vacuum' }
        ]);
      case 'Sports & Fitness':
        return subCategories.concat([
          { name: 'Equipment', icon: 'bi bi-dumbbell' },
          { name: 'Clothing', icon: 'bi bi-tshirt' },
          { name: 'Accessories', icon: 'bi bi-watch' }
        ]);
      case 'Video Games':
        return subCategories.concat([
          { name: 'Consoles', icon: 'bi bi-controller' },
          { name: 'Games', icon: 'bi bi-gamepad' },
          { name: 'Accessories', icon: 'bi bi-headset' }
        ]);
      case 'Toys & Hobbies':
        return subCategories.concat([
          { name: 'Action Figures', icon: 'bi bi-robot' },
          { name: 'Board Games', icon: 'bi bi-grid' },
          { name: 'Puzzles', icon: 'bi bi-puzzle' }
        ]);
      case 'Auto Parts':
        return subCategories.concat([
          { name: 'Engine', icon: 'bi bi-gear' },
          { name: 'Body', icon: 'bi bi-car-front' },
          { name: 'Interior', icon: 'bi bi-steering-wheel' }
        ]);
      case 'Groceries':
        return subCategories.concat([
          { name: 'Fruits', icon: 'bi bi-apple' },
          { name: 'Vegetables', icon: 'bi bi-carrot' },
          { name: 'Dairy', icon: 'bi bi-milk' }
        ]);
      case 'Health & Personal Care':
        return subCategories.concat([
          { name: 'Medical Supplies', icon: 'bi bi-first-aid' },
          { name: 'Personal Hygiene', icon: 'bi bi-hand-sanitizer' },
          { name: 'Fitness', icon: 'bi bi-heart-pulse' }
        ]);
      case 'Books & Media':
        return subCategories.concat([
          { name: 'Books', icon: 'bi bi-book' },
          { name: 'Magazines', icon: 'bi bi-journal' },
          { name: 'Music', icon: 'bi bi-music-note' }
        ]);
      case 'Pet Supplies':
        return subCategories.concat([
          { name: 'Food', icon: 'bi bi-bone' },
          { name: 'Toys', icon: 'bi bi-ball' },
          { name: 'Grooming', icon: 'bi bi-scissors' }
        ]);
      case 'Perfumes':
        return subCategories.concat([
          { name: 'Men', icon: 'bi bi-bottle' },
          { name: 'Women', icon: 'bi bi-bottle-fill' },
          { name: 'Unisex', icon: 'bi bi-bottle-half' }
        ]);
      default:
        return subCategories;
    }
  }
}
