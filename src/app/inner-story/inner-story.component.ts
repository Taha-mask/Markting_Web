import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../safe-url.pipe'; 
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-inner-story',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe,FormsModule],
  templateUrl: './inner-story.component.html',
  styleUrls: ['./inner-story.component.css']
})
export class InnerStoryComponent {
  likes = 0;
  liked = false;
  showComments = false;
  comments: string[] = [];
  newComment: string = '';
  
 

  currentStoryIndex = 0;

  stories = [
    { user: 'Al-Husseini', image: 'images/husseini.jpg' },
    { user: 'Taha', image: 'images/taha.jpg' },
    { user: 'Hassan', image: 'images/hassan.jpg' },
    { user: 'Shahd', image: 'images/shahd.jpg' },
    { user: 'Asmaa', image: 'images/asmaa.jpg' }
  ];

  selectStory(index: number): void {
    this.currentStoryIndex = index;
  }

  currentVideoIndex = 0;

  videos = [
    { src: 'vedios/الانسان المصري بياكل كم جرا سكر ؟.mp4', type: 'video' },
    { src: 'vedios/992596-hd_1920_1080_25fps.mp4', type: 'video' },
    { src: 'vedios/6035962_Gym_Fitness_1280x720.mp4', type: 'video' }
  ];

  goToPreviousStory(): void {
    if (this.currentStoryIndex > 0) {
      this.currentStoryIndex--;
    }
  }

  goToNextStory(): void {
    if (this.currentStoryIndex < this.stories.length - 1) {
      this.currentStoryIndex++;
    }
  }
   //like
   toggleLike() {
    if(this.liked){
      this.likes--;
    }
      else {
        this.likes++;
      }
      this.liked = !this.liked;
    }
    toggleComments() {
      this.showComments = !this.showComments;
    }
  
    // إضافة تعليق جديد
    addComment() {
      if (this.newComment.trim() !== '') {  
        this.comments.push(this.newComment);  
        this.newComment = '';  
      }
    }
  
}
