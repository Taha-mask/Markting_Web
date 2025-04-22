// src/app/interfaces/post.ts
import { PostComment } from './Comment';

export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  author: string;
  date: Date;
  username: string;
  profileImageUrl: string;
  timestamp: Date;
  category: string;
  subCategory?: string;
  images: string[];
  currentImageIndex: number;
  likes: number;
  Shares: number;
  Saves: number;
  showComments: boolean;
  isEditing: boolean;
  liked: boolean;
  saved: boolean;
  comments: PostComment[];
  isFollowing: boolean;
  isPro?: boolean;
  isProcessing?: boolean;
  reactions?: { [key: string]: number };
  topReactions?: { reaction: string; count: number }[];
  reactionUsers?: { username: string; profileImageUrl: string; reactionType: string; timestamp: Date }[];
  isPinned?: boolean;
  showReactionUsers?: boolean;
}


