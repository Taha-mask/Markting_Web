import { Component, ViewChild, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../safe-url.pipe';
import { FormsModule } from '@angular/forms';
// import { ModalStoryComponent,} from '../modal-story/modal-story.component';

@Component({
  selector: 'app-inner-story',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe, FormsModule],
  templateUrl: './inner-story.component.html',
  styleUrls: ['./inner-story.component.css']
})
export class InnerStoryComponent {
  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>;

  likes = 0;
  liked = false;
  showComments = false;
  showShareSection: boolean = false;
  showOptions = false;
  comments: string[] = [];
  newComment: string = '';
  showModal = false;

  currentStoryIndex = 0;
  isSidebarVisible: boolean = false;
  transitioning: boolean = false; // لتفعيل التأثير

  stories_users = [
    { user: 'Al-Husseini', image: 'images/husseini.jpg' },
    { user: 'Taha', image: 'images/taha.jpg' },
    { user: 'Hassan', image: 'images/hassan.jpg' },
    { user: 'Shahd', image: 'images/shahd.jpg' },
    { user: 'Asmaa', image: 'images/asmaa.jpg' }
  ];

  story = [
    { src: 'vedios/الانسان المصري بياكل كم جرام سكر ؟.mp4', type: 'video', description: 'How much sugar Egyptian person eat' },
    { src: 'vedios/اختبرت قوة اقوي عامل نظافة في العالم !.mp4', type: 'video', description: 'أقوى قبضة في العالم' },
  ];

  constructor(private renderer: Renderer2) {}

  selectStory(index: number): void {
    this.currentStoryIndex = index;
  }

  goToPreviousStory(): void {
    if (this.currentStoryIndex > 0) {
      this.applyTransition();
      setTimeout(() => {
        this.currentStoryIndex--;
        this.removeTransition();
      }, 100); // وقت التأثير
    }
  }

  goToNextStory(): void {
    if (this.currentStoryIndex < this.story.length - 1) {
      this.applyTransition();
      setTimeout(() => {
        this.currentStoryIndex++;
        this.removeTransition();
      }, 100); // وقت التأثير
    }
  }

  toggleLike() {
    this.liked = !this.liked;
    this.likes += this.liked ? 1 : -1;
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  addComment() {
    if (this.newComment.trim() !== '') {
      this.comments.push(this.newComment);
      this.newComment = '';
    }
  }

  togglePlayPause() {
    const video = this.videoPlayer.nativeElement;
    video.paused ? video.play() : video.pause();
  }


  toggleShareSection(event: Event) {
    event.stopPropagation(); // يمنع الإغلاق عند الضغط على زر المشاركة
    this.showShareSection = !this.showShareSection;
  }

  closeShareSection() {
    this.showShareSection = false;
  }
 

  closeCommentSection(): void {
    this.showComments = false;
  }

  toggleOptions(event: Event) {
    this.showOptions = !this.showOptions;
    event.stopPropagation(); 
  }

  showDescription() {
    console.log('Show Description Clicked');
  }

  showReport() {
    console.log('Show Report Clicked');
  }

  @HostListener('document:click', ['$event'])
onClickOutside(event: Event) {
  const target = event.target as HTMLElement;

  
  if (!target.closest('.share-section') && !target.closest('.share-btn')) {
    this.showShareSection = false;
  }

  
  if (!target.closest('.options-section') && !target.closest('.options-btn')) {
    this.showOptions = false;
  }
}

  toggleList() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  
  private touchStartY: number = 0;
  private touchEndY: number = 0;

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartY = event.touches[0].clientY;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    this.touchEndY = event.changedTouches[0].clientY;
    this.handleSwipe();
  }

  private handleSwipe() {
    const swipeThreshold = 50; // الحد الأدنى للحركة

    if (this.touchStartY - this.touchEndY > swipeThreshold) {
      this.goToNextStory();
    } else if (this.touchEndY - this.touchStartY > swipeThreshold) {
      this.goToPreviousStory();
    }
  }

  private applyTransition() {
    this.transitioning = true;
  }

  private removeTransition() {
    setTimeout(() => {
      this.transitioning = false;
    }, 300); 
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

}
