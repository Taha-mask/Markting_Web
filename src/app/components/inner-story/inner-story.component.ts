import { Component, ViewChild, ElementRef, Renderer2, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { trigger, transition, style, animate } from '@angular/animations';
import { StoryViewerComponent } from '../story-viewer/story-viewer.component';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';

interface Story {
  id: number;
  src: string;
  type: 'video' | 'image';
  description: string;
  user: {
    name: string;
    image: string;
  };
  uploadTime: Date;
  likes: number;
  views: number;
  isLiked: boolean;
  isSaved: boolean;
  comments: Comment[];
  isAdvertisement?: boolean;
  advertisementDuration?: number; // Duration in days
  advertisementEndDate?: Date;
  advertisementCost?: number;
  advertisementStatus?: 'active' | 'expired' | 'pending';
  targetAudience?: string[];
  advertisementStats?: {
    clicks: number;
    impressions: number;
    engagement: number;
  };
}

interface Comment {
  id: number;
  text: string;
  userImage: string;
  username: string;
  time: Date;
  likes: number;
  dislikes: number;
  isLiked: boolean;
  isDisliked: boolean;
  replies: Comment[];
}

@Component({
    selector: 'app-inner-story',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TimeagoModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatSliderModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatChipsModule
        // Note: StoryViewerComponent is used via MatDialog.open() and not directly in the template
    ],
    templateUrl: './inner-story.component.html',
    styleUrls: ['./inner-story.component.css'],
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(10px)' }),
                animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ]),
            transition(':leave', [
                animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
            ])
        ]),
        trigger('slideInOut', [
            transition(':enter', [
                style({ transform: 'translateX(100%)' }),
                animate('300ms ease-out', style({ transform: 'translateX(0)' }))
            ]),
            transition(':leave', [
                animate('300ms ease-in', style({ transform: 'translateX(100%)' }))
            ])
        ])
    ]
})
export class InnerStoryComponent implements OnInit {
  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('fileInput') fileInput!: ElementRef;

  stories: Story[] = [
    {
      id: 1,
      src: '/public/vedios/الانسان المصري بياكل كم جرام سكر ؟.mp4',
      type: 'video',
      description: 'Check out this amazing story!',
      user: {
        name: 'Al-Husseini',
        image: '/public/images/user-2.png'
      },
      uploadTime: new Date(),
      likes: 120,
      views: 1500,
      isLiked: false,
      isSaved: false,
      comments: []
    },
    {
      id: 2,
      src: '/public/vedios/الانسان المصري بياكل كم جرام سكر ؟.mp4',
      type: 'video',
      description: 'Another interesting story',
      user: {
        name: 'Taha',
        image: '/public/images/user-1.png'
      },
      uploadTime: new Date(),
      likes: 85,
      views: 1200,
      isLiked: false,
      isSaved: false,
      comments: []
    }
  ];

  currentStoryIndex = 0;
  isSidebarVisible = true;
  showComments = false;
  showShareModal = false;
  showOptions = false;
  newComment = '';
  isLoading = false;
  isPlaying = true;
  progress = 0;
  duration = 0;
  volume = 1;
  isMuted = false;
  showVolumeSlider = false;
  showProgressBar = true;
  hideControlsTimeout: any;

  // Advertisement related properties
  isCreatingAdvertisement = false;
  advertisementDuration = 7; // Default 7 days
  advertisementCost = 0;
  selectedTargetAudience: string[] = [];
  availableAudiences = ['General', 'Men', 'Women', 'Youth', 'Adults', 'Seniors', 'Professionals', 'Students'];
  costPerDay = 10; // Base cost per day in dollars

  constructor(private dialog: MatDialog, private renderer: Renderer2, private router: Router) {}

  ngOnInit() {
    console.log('Stories:', this.stories);
    console.log('Current Story Index:', this.currentStoryIndex);
    this.initializeVideoPlayer();
  }

  private initializeVideoPlayer() {
    if (this.videoPlayer) {
      console.log('Video Player initialized');
      const video = this.videoPlayer.nativeElement;
      video.addEventListener('timeupdate', () => {
        this.progress = (video.currentTime / video.duration) * 100;
      });
      video.addEventListener('loadedmetadata', () => {
        this.duration = video.duration;
        console.log('Video duration:', this.duration);
      });
    } else {
      console.log('Video Player not found');
    }
  }

  // Method to open file picker with optional advertisement flag
  
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
  
    const file = input.files[0];
    const fileType = file.type.startsWith('video') ? 'video' : 'image';
  
    const reader = new FileReader();
    reader.onload = () => {
      const fileUrl = reader.result as string;
      if (!fileUrl) return;

      const dialogRef = this.dialog.open(StoryViewerComponent, {
        data: {
          url: fileUrl,
          type: fileType,
          isAdvertisement: this.isCreatingAdvertisement,
          advertisementDuration: this.advertisementDuration,
          selectedTargetAudience: this.selectedTargetAudience,
          advertisementCost: this.advertisementCost
        },
        width: '100%',
        height: '100%',
        panelClass: 'fullscreen-dialog'
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result?.url && result?.description) {
          // If creating an advertisement, update the advertisement properties
          if (result.isAdvertisement) {
            this.advertisementDuration = result.advertisementDuration;
            this.selectedTargetAudience = result.selectedTargetAudience;
            this.updateAdvertisementCost();
          }

          this.addNewStory(
            result.url,
            fileType,
            result.description,
            result.isAdvertisement
          );
        }
      });
    };
    reader.readAsDataURL(file);
  }
  
  private addNewStory(url: string, type: 'video' | 'image', description: string, isAdvertisement = false) {
    const newStory: Story = {
      id: this.stories.length + 1,
      src: url,
      type,
      description,
      user: {
        name: 'Al-Husseini',
        image: 'images/user-2.png'
      },
      uploadTime: new Date(),
      likes: 0,
      views: 0,
      isLiked: false,
      isSaved: false,
      comments: [],
      isAdvertisement: isAdvertisement
    };

    if (isAdvertisement) {
      // Calculate end date based on duration
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + this.advertisementDuration);

      // Add advertisement specific properties
      newStory.advertisementDuration = this.advertisementDuration;
      newStory.advertisementEndDate = endDate;
      newStory.advertisementCost = this.calculateAdvertisementCost();
      newStory.advertisementStatus = 'active';
      newStory.targetAudience = [...this.selectedTargetAudience];
      newStory.advertisementStats = {
        clicks: 0,
        impressions: 1, // Start with 1 impression (the creator)
        engagement: 0
      };
    }

    this.stories.unshift(newStory);

    // Reset advertisement creation state
    if (isAdvertisement) {
      this.resetAdvertisementForm();
    }
  }

  resetAdvertisementForm() {
    this.isCreatingAdvertisement = false;
    this.advertisementDuration = 7;
    this.selectedTargetAudience = [];
    this.advertisementCost = 0;
  }

  calculateAdvertisementCost(): number {
    // Base calculation: cost per day * number of days
    let cost = this.costPerDay * this.advertisementDuration;

    // Add premium for targeted audiences (more specific targeting costs more)
    if (this.selectedTargetAudience.length > 0) {
      cost += (this.selectedTargetAudience.length * 5); // $5 per target audience segment
    }

    return cost;
  }

  updateAdvertisementCost() {
    this.advertisementCost = this.calculateAdvertisementCost();
  }

  toggleAdvertisementCreation() {
    this.isCreatingAdvertisement = !this.isCreatingAdvertisement;
    if (this.isCreatingAdvertisement) {
      this.updateAdvertisementCost();
    }
  }

  toggleAudienceSelection(audience: string) {
    const index = this.selectedTargetAudience.indexOf(audience);
    if (index === -1) {
      this.selectedTargetAudience.push(audience);
    } else {
      this.selectedTargetAudience.splice(index, 1);
    }
    this.updateAdvertisementCost();
  }

  createAdvertisement() {
    this.openFilePicker(true);
  }

  openFilePicker(isAdvertisement = false) {
    this.isCreatingAdvertisement = isAdvertisement;
    this.fileInput.nativeElement.click();
  }

  togglePlayPause() {
    if (this.videoPlayer) {
      if (this.isPlaying) {
        this.videoPlayer.nativeElement.pause();
      } else {
        this.videoPlayer.nativeElement.play();
      }
      this.isPlaying = !this.isPlaying;
    }
  }

  seekTo(event: MouseEvent) {
    if (this.videoPlayer) {
      const progressBar = event.currentTarget as HTMLElement;
      const rect = progressBar.getBoundingClientRect();
      const pos = (event.clientX - rect.left) / rect.width;
      this.videoPlayer.nativeElement.currentTime = pos * this.duration;
    }
  }

  toggleMute() {
    if (this.videoPlayer) {
      this.isMuted = !this.isMuted;
      this.videoPlayer.nativeElement.muted = this.isMuted;
    }
  }

  setVolume(event: Event) {
    const input = event.target as HTMLInputElement;
    this.volume = parseFloat(input.value);
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.volume = this.volume;
    }
  }

  toggleLike(story: Story) {
    story.isLiked = !story.isLiked;
    story.likes += story.isLiked ? 1 : -1;
  }

  toggleSave(story: Story) {
    story.isSaved = !story.isSaved;
  }

  addComment(story: Story) {
    if (this.newComment.trim()) {
      const comment: Comment = {
        id: story.comments.length + 1,
        text: this.newComment,
        userImage: 'images/user-2.png',
        username: 'Al-Husseini',
        time: new Date(),
        likes: 0,
        dislikes: 0,
        isLiked: false,
        isDisliked: false,
        replies: []
      };
      story.comments.unshift(comment);
      this.newComment = ''; 
    }
  }

  likeComment(comment: Comment) {
    comment.isLiked = !comment.isLiked;
    comment.likes += comment.isLiked ? 1 : -1;
    if (comment.isLiked && comment.isDisliked) {
      comment.isDisliked = false;
        comment.dislikes--;
    }
  }

  dislikeComment(comment: Comment) {
    comment.isDisliked = !comment.isDisliked;
    comment.dislikes += comment.isDisliked ? 1 : -1;
    if (comment.isDisliked && comment.isLiked) {
      comment.isLiked = false;
        comment.likes--;
    }
  }

  shareStory(story: Story) {
    this.showShareModal = true;
    // Implement sharing logic

    // If this is an advertisement, increment engagement
    if (story.isAdvertisement && story.advertisementStats) {
      story.advertisementStats.engagement++;
    }
  }

  /**
   * Checks if an advertisement is currently active based on its end date
   */
  isAdActive(story: Story): boolean {
    if (!story.isAdvertisement || !story.advertisementEndDate) {
      return false;
    }

    const now = new Date();
    return now < story.advertisementEndDate;
  }

  /**
   * Calculates the number of days remaining for an advertisement
   */
  getDaysRemaining(story: Story): number {
    if (!story.isAdvertisement || !story.advertisementEndDate) {
      return 0;
    }

    const now = new Date();
    const endDate = new Date(story.advertisementEndDate);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        this.previousStory();
        break;
      case 'ArrowDown':
        this.nextStory();
        break;
      case ' ':
        this.togglePlayPause();
        break;
    }
  }

  previousStory() {
    if (this.currentStoryIndex > 0) {
      this.currentStoryIndex--;
      this.resetVideoState();
    }
  }

  nextStory() {
    if (this.currentStoryIndex < this.stories.length - 1) {
      this.currentStoryIndex++;
      this.resetVideoState();
    }
  }

  private resetVideoState() {
    this.isPlaying = true;
    this.progress = 0;
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.currentTime = 0;
      this.videoPlayer.nativeElement.play();
    }
  }

  showControls() {
    this.showProgressBar = true;
    clearTimeout(this.hideControlsTimeout);
    this.hideControlsTimeout = setTimeout(() => {
      this.showProgressBar = false;
    }, 3000);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  handleVideoError(event: any) {
    console.error('Video Error:', event);
    // يمكنك إضافة رسالة خطأ للمستخدم هنا
  }

  onVideoLoaded() {
    console.log('Video loaded successfully');
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.play().catch(error => {
        console.error('Error playing video:', error);
      });
    }
  }
}
