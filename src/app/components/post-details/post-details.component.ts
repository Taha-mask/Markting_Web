import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Post } from '../../interfaces/post';
import { HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'app-post-details',
    imports: [CommonModule, HttpClientModule],
    templateUrl: './post-details.component.html',
    styleUrl: './post-details.component.css'
})
export class PostDetailsComponent implements OnInit {
  postId: string | null = null;
  post: Post | null = null;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.postId = params.get('id');
      if (this.postId) {
        this.loadPostDetails();
      }
    });
  }

  loadPostDetails() {
    if (this.postId) {
      this.postService.getPost(this.postId).subscribe({
        next: (post) => {
          this.post = post;
        },
        error: (error) => {
          console.error('Error loading post:', error);
          // Here you might want to add error handling UI
        }
      });
    }
  }
}
