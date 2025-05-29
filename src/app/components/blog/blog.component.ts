import { Component } from '@angular/core';

@Component({
    selector: 'app-blog',
    imports: [],
    templateUrl: './blog.component.html',
    styleUrl: './blog.component.css'
})
export class BlogComponent {
  likes = 0;

  likePost() {
    this.likes++;
  }

  sharePost() {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Post URL copied to clipboard!');
  }

  addComment() {
    const textarea = document.getElementById('commentBox') as HTMLTextAreaElement;
    const commentText = textarea.value.trim();
  
    if (commentText !== '') {
      const commentSection = document.getElementById('commentsSection');
      const template = document.getElementById('commentTemplate') as HTMLDivElement;
  
      if (template && commentSection) {
        // نسخ القالب
        const newComment = template.firstElementChild?.cloneNode(true) as HTMLElement;
  
        // وضع النص داخل العنصر
        const textDiv = newComment.querySelector('.comment-text');
        if (textDiv) {
          textDiv.textContent = commentText;
        }
  
        commentSection.appendChild(newComment);
        textarea.value = '';
      }
    }
  }
}