import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { Post } from '../../interfaces/post';
import { HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'app-postone',
    imports: [FormsModule, CommonModule, HttpClientModule],
    templateUrl: './postone.component.html',
    styleUrls: ['./postone.component.css']
})
export class PostoneComponent implements OnInit {
  posts: Post[] = [];
  loading = true;
  error = false;
  
  comments: any[] = [];
  
  constructor(private postService: PostService) {}

  showComments: boolean = false;
  liked: boolean = false;
  commentText: string = '';
  showReplies: boolean[] = [];
  
  ngOnInit() {
    this.loadPosts();
  }
  
  loadPosts() {
    this.loading = true;
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }


  toggleComments(post: Post): void {
    post.showComments = !post.showComments;
  }


  likePost(post: Post): void {
    post.liked = !post.liked;
    // Here you would call the API to like the post
    // this.postService.likePost(post.id).subscribe(...);
  }
  commentPost(post: Post): void {
    if (this.commentText.trim()) {
      const comment = {
        id: this.generateUniqueId(),
        postId: post.id,
        username: 'Current User', // This should be the logged-in user
        content: this.commentText,
        timestamp: new Date(),
        likes: 0,
        replies: []
      };
      
      // Here you would call the API to add the comment
      // this.postService.addComment(post.id, comment).subscribe(...);
      
      // For now, just add it to the local post object
      if (!post.comments) {
        post.comments = [];
      }
      post.comments.push(comment);
      this.commentText = '';
    }
  }
  
  generateUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }


  likeComment(post: Post, commentId: string): void {
    if (post.comments) {
      const comment = post.comments.find(c => c.id === commentId);
      if (comment) {
        comment.likes = (comment.likes || 0) + 1;
        // Here you would call the API to like the comment
        // this.postService.likeComment(commentId).subscribe(...);
      }
    }
  }


  toggleReply(comment: any): void {
    comment.showReplies = !comment.showReplies;
  }


  replyToComment(post: Post, comment: any): void {
    if (comment.replyText && comment.replyText.trim()) {
      const reply = {
        id: this.generateUniqueId(),
        username: 'Current User', // This should be the logged-in user
        content: comment.replyText,
        timestamp: new Date(),
        likes: 0
      };
      
      if (!comment.replies) {
        comment.replies = [];
      }
      
      comment.replies.push(reply);
      comment.replyText = '';
      
      // Here you would call the API to add the reply
      // this.postService.addReply(comment.id, reply).subscribe(...);
    }
  }

  // Share post function
  sharePost(post: Post): void {
    console.log("Post shared:", post.id);
    // Here you would call the API to share the post
    // this.postService.sharePost(post.id).subscribe(...);
  }
}
