import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  addComment(commentData: { content: string; postId: string }): Observable<{ id: string; content: string; timestamp: Date }> {
    // TODO: Implement actual API call
    return of({
      id: Date.now().toString(),
      content: commentData.content,
      timestamp: new Date()
    });
  }
}
