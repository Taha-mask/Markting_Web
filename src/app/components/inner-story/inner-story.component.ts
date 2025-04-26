import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeagoModule } from 'ngx-timeago';
import { StoryViewerComponent } from '../story-viewer/story-viewer.component';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { HostListener } from '@angular/core';


@Component({
  selector: 'app-inner-story',
  standalone: true,
  imports: [CommonModule, FormsModule, TimeagoModule, StoryViewerComponent],
  templateUrl: './inner-story.component.html',
  styleUrls: ['./inner-story.component.css']
})
export class InnerStoryComponent {
  
  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('fileInput') fileInput!: ElementRef;

  previewUrl: string | null = null;
  isImage = false;
  isVideo = false;

  likes = 0;
  liked = false;
  showComments = false;
  showShareSection: boolean = false;
  showOptions = false;
  comments: { text: string; userImage: string; username: string; time: Date; likes: number; dislikes: number; liked: boolean; disliked: boolean }[] = [];  

  showModal = false;
  newComment = "";
  currentUser = { user: 'Al-Husseini', image: 'images/husseini.jpg' };
  selectedFileUrl: string | null = null; 
  selectedFileType: string | null = null;
  storyDescription: string = ""; 

  currentStoryIndex = 0;
  isSidebarVisible: boolean = false;
  transitioning: boolean = false;

  users = [
    { user: 'Al-Husseini', image: 'images/husseini.jpg', time: new Date(), likes: 0, dislikes: 0, loved: false, text: this.newComment },
    { user: 'Taha', image: 'images/taha.jpg', time: new Date(), text: "nice work", likes: 0, dislikes: 0, loved: false },
    { user: 'Hassan', image: 'images/hassan.jpg', time: new Date(), text: "", likes: 0, dislikes: 0, loved: false },
    { user: 'Shahd', image: 'images/shahd.jpg', time: new Date(), text: "", likes: 0, dislikes: 0, loved: false },
    { user: 'Asmaa', image: 'images/asmaa.jpg', time: new Date(), text: "", likes: 0, dislikes: 0, loved: false }
  ];
  
  publishedStories: { 
    src: string; 
    type: string; 
    description: string; 
    user: string; 
    uploadTime: Date; 
  }[] = [
    {
      src: "vedios/الانسان المصري بياكل كم جرام سكر ؟.mp4", // لينك الفيديو الافتراضي
      type: "video",
      description: "test Story",
      user: "Admin",
      uploadTime: new Date()
    }
  ];
  
  

  currentStoryIndexPublished: number = 0;
  
  story = [
    { src: 'vedios/الانسان المصري بياكل كم جرام سكر ؟.mp4', type: 'video', description: 'How much sugar Egyptian person eat' },
    { src: 'vedios/اختبرت قوة اقوي عامل نظافة في العالم !.mp4', type: 'video', description: 'أقوى قبضة في العالم' }
  ];
  
  constructor(private dialog: MatDialog, private renderer: Renderer2) {}

  selectPublishedStory(index: number): void {
    if (index < 0 || index >= this.publishedStories.length) return;

    this.currentStoryIndexPublished = index;
    this.openStoryViewer();
  }

  openStoryViewer(): void {
    if (!this.publishedStories || this.publishedStories.length === 0 || this.currentStoryIndexPublished < 0 || this.currentStoryIndexPublished >= this.publishedStories.length) return;

    const story = this.publishedStories[this.currentStoryIndexPublished];

    const dialogRef = this.dialog.open(StoryViewerComponent, {

      data: { 
        url: story.src, 
        type: story.type
      },
      width: '80vw',
      height: '90vh',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterOpened().subscribe(() => {
      document.body.classList.add('modal-open');
    });
    
    dialogRef.afterClosed().subscribe(() => {
      document.body.classList.remove('modal-open');
    });
    

  }

  openFilePicker() {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }
  
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
  
    const file = input.files[0];
    const fileType = file.type.startsWith('video') ? 'video' : 'image';
  
    const reader = new FileReader();
    reader.onload = () => {
      const fileUrl = reader.result as string;
  
      if (!fileUrl) {
        console.error("Failed to load file URL");
        return;
      }
  
      // افتح preview للستوري في الديالوج
      const dialogRef = this.dialog.open(StoryViewerComponent, {
        data: { url: fileUrl, type: fileType },
        width: '0vw',
        height: '0vh',
        panelClass: 'fullscreen-dialog'
      });
  
      // استقبل البيانات بعد ما اليوزر يضغط Confirm
      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.url && result.description) {
          const newStory = {
            src: result.url,
            type: result.type,
            description: result.description,
            uploadTime: new Date(),
            user: 'Elhusseini'
          };
  
          this.publishedStories.push(newStory);
          console.log("Story Added to List: ", this.publishedStories);
        }
      });
    };
  
    reader.readAsDataURL(file);
  }
  

  confirmStory(): void {
    if (this.selectedFileUrl) {
      const newStory = {
        src: this.selectedFileUrl,
        type: this.selectedFileType!,
        description: this.storyDescription,
        user: "Al-Husseini",
        uploadTime: new Date()
      };

      this.publishedStories.push(newStory);
      this.selectedFileUrl = null;
      this.selectedFileType = null;
      this.storyDescription = "";
    }
  }

  goToPreviousStory(): void {
    if (this.currentStoryIndexPublished > 0) {
      this.applyTransition();
      setTimeout(() => {
        this.currentStoryIndexPublished--;
        this.removeTransition();
      }, 100);
    }
  }



  goToNextStory(): void {
    if (this.currentStoryIndexPublished < this.publishedStories.length - 1) {
      this.applyTransition();
      setTimeout(() => {
        this.currentStoryIndexPublished++;
        this.removeTransition();
      }, 100);
    }
  }

  
  toggleLike() {
    this.liked = !this.liked;
    this.likes += this.liked ? 1 : -1;
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  // add conmment
  addComment() {
    if (this.newComment.trim()) {
      const newCommentObj = {
        text: this.newComment,
        userImage: 'images/husseini.jpg', 
        username: 'User123',
        time: new Date(),
        likes: 0,
        dislikes: 0,
        liked: false,
        disliked: false
      };
  
      this.comments.unshift(newCommentObj); 
      this.newComment = ''; 
      
      
    }
    
  }
  likeComment(comment: any) {
    if (comment.liked) {
      comment.liked = false;
      comment.likes--;
    } else {
      comment.liked = true;
      comment.likes++;
  
      // إلغاء الديسلايك لو كان موجود
      if (comment.disliked) {
        comment.disliked = false;
        comment.dislikes--;
      }
    }
  }
  
  dislikeComment(comment: any) {
    if (comment.disliked) {
      comment.disliked = false;
      comment.dislikes--;
    } else {
      comment.disliked = true;
      comment.dislikes++;
  
      // إلغاء اللايك لو كان موجود
      if (comment.liked) {
        comment.liked = false;
        comment.likes--;
      }
    }
  }
  

  togglePlayPause() {
    const video = this.videoPlayer.nativeElement;
    video.paused ? video.play() : video.pause();
  }


  toggleShareSection(event: Event) {
    event.stopPropagation(); 
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
    const swipeThreshold = 50; 

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

  
  closeComments(event: MouseEvent) {
    const target = event.target as HTMLElement;
    
    if (target.classList.contains('close-btn')) {
      this.showComments = false;
      event.stopPropagation();  
      return;
    }
  
    const commentsSection = document.querySelector('.comments-section');
    if (commentsSection && !commentsSection.contains(target)) {
      this.showComments = false;
    }
  }
  

  shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  }
    
  
  shareOnWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://api.whatsapp.com/send?text=${url}`, '_blank');
  }
  
  copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy link:', err);
    });
  }


  storytime = {
    uploadTime: new Date(Date.now())
  };
  

  ////////////////////////

  // @ViewChild('fileInput') fileInput!: ElementRef;

  // openFilePicker() {
  //   this.fileInput.nativeElement.click();
  // }
  
  
  // onFileSelected(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     const file = input.files[0];
  //     this.selectedFileType = file.type.startsWith('video') ? 'video' : 'image';
  
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.selectedFileUrl = reader.result as string;
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }


 

  // openModal() {
  //   this.showModal = true;
  // }

  // closeModal() {
  //   this.showModal = false;
  // }

}