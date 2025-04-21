import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SavedPost {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  timestamp: Date;
  username: string;
  userImage: string;
}

@Component({
  standalone: true,
  selector: 'app-saved-post',
  imports: [CommonModule],
  templateUrl: './saved-post.component.html',
  styleUrls: ['./saved-post.component.css']
})
export class SavedPostComponent implements OnInit {
  savedPosts: SavedPost[] = [
    {
      id: 1,
      title: 'Post 1',
      description: 'This is the description for the first saved post.',
      imageUrl: 'images/post-image-1.png',
      timestamp: new Date(),
      username: 'Ahmed Ali',
      userImage: 'images/user-1.png'
    },
    {
      id: 2,
      title: 'Post 2',
      description: 'This is the description for the second saved post.',
      imageUrl: 'images/post-image-3.png',
      timestamp: new Date(),
      username: 'Sara Mohamed',
      userImage: 'images/user-2.png'
    }
  ];

  deletePost(id: number) {
    this.savedPosts = this.savedPosts.filter(post => post.id !== id);
  }

  orderNow(post: SavedPost) {
    alert(`Order placed for: ${post.title}`);
    // You can add your order logic here
  }

  ngOnInit(): void {}
}