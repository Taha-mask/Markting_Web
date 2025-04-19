// src/app/interfaces/post.ts
export interface Post {
  username: string;
  profileImageUrl: string;
  timestamp: Date;
  content: string;
  category: string;
  images: string[];
  currentImageIndex: number;
  likes: number;
  Shares: number;
  Saves: number;
  showComments: boolean;
  isEditing: boolean;
  liked: boolean;
  saved: boolean;
  comments: Comment[];
  isFollowing: boolean;
  isPro?: boolean;
  isProcessing?: boolean;
}
