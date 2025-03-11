import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root', // علشان الـ Service يكون متاح في كل الـ App
})
export class PostService {
  private postSubject = new Subject<any>(); // Subject علشان نرسل البيانات

  // Observable علشان نسمع للتغييرات
  getPostObservable() {
    return this.postSubject.asObservable();
  }

  // دالة علشان نضيف بوست جديد
  addPost(newPost: any) {
    this.postSubject.next(newPost); // إرسال البوست الجديد
  }
}
