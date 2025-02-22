import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inner-story',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  currentStoryIndex = 0;
  currentVideoIndex = 0;

  stories_users = [
    { user: 'Al-Husseini', image: 'images/husseini.jpg' },
    { user: 'Taha', image: 'images/taha.jpg' },
    { user: 'Hassan', image: 'images/hassan.jpg' },
    { user: 'Shahd', image: 'images/shahd.jpg' },
    { user: 'Asmaa', image: 'images/asmaa.jpg' }
  ];

  story = [
    { src: 'vedios/الانسان المصري بياكل كم جرام سكر ؟.mp4', type: 'video', description: 'How much shuger egyptian person eat ' },
  ];

  selectStory(index: number): void {
    this.currentStoryIndex = index;
  }

  goToPreviousStory(): void {
    if (this.currentStoryIndex > 0) {
      this.currentStoryIndex--;
    }
  }

  goToNextStory(): void {
    if (this.currentStoryIndex < this.stories_users.length - 1) {
      this.currentStoryIndex++;
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

  toggleShareSection(): void {
    this.showShareSection = !this.showShareSection;
  }

  closeShareSection(): void {
    this.showShareSection = false;
  }

  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  showDescription() {
    console.log('Description clicked');
  }

  showReport() {
    console.log('Report clicked');
  }
}
