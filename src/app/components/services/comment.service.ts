import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private baseUrl = 'http://brandit.runasp.net/api/Comment';

  constructor(private http: HttpClient) {}

  getComments(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  addComment(commentData: any): Observable<any> {
    return this.http.post(this.baseUrl, commentData);
  }

  likeComment(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/like/${id}`, {});
  }

  unlikeComment(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/unlike/${id}`, {});
  }
}
