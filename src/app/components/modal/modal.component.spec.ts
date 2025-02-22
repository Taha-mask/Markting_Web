import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common'; // استيراد CommonModule

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule], // إضافة CommonModule إلى imports
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
toggleEmojiPicker() {
throw new Error('Method not implemented.');
}
addEmoji($event: Event) {
throw new Error('Method not implemented.');
}
  @ViewChild('postModal') postModal!: ElementRef; // للوصول إلى الـ Modal

  previewUrls: string[] = []; // مصفوفة لتخزين روابط الصور
  currentIndex: number = 0; // الفهرس الحالي للصورة المعروضة
  selectedAudience: string = 'public'; // خاصية لتخزين الجمهور المحدد
  selectedAudienceText: string = 'Select audience'; // نص الجمهور المحدد

  // بيانات المستخدمين (مثال)
  users = [
    { username: 'Taha' },
    { username: 'Mahmoud' }
  ];
showEmojiPicker: any;

  constructor() {}

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
      onlyMe: 'Only Me'
    };
    this.selectedAudienceText = audienceMap[this.selectedAudience as keyof typeof audienceMap];
  }

  // دالة لتعقب المستخدمين بواسطة اسم المستخدم
  trackByUsername(index: number, user: any): string {
    return user.username;
  }

  // دالة لفتح Modal الجمهور
  openAudienceModal(): void {
    const audienceModal = document.getElementById('audienceModal');
    if (audienceModal) {
      audienceModal.classList.add('show');
      audienceModal.style.display = 'block';
    }
  }
}
