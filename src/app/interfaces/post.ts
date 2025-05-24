// src/app/interfaces/post.ts

export interface Post {
  id: string;
  username: string;
  profileImageUrl: string;
  timestamp: Date;
  content: string;
  category?: string;
  subCategory?: string;
  images?: string[];
  currentImageIndex?: number;
  likes?: number;
  Shares?: number;
  Saves?: number;
  showComments?: boolean;
  isEditing?: boolean;
  liked?: boolean;
  saved?: boolean;
  isFollowing?: boolean;
  job?: string;
  comments?: Comment[];
  isPinned?: boolean;
  price?: number | null;
  audience?: string;
  showReactionPicker?: boolean;
  media?: {
    type: 'image' | 'video' | 'document';
    url: string;
    name?: string;
    size?: number;
    thumbnailUrl?: string;
    isLoading?: boolean;
    zoom?: number;
    pages?: string[];
    currentPage?: number;
  }[];
  reactions?: { [key: string]: Array<{ id: string, timestamp: Date }> };
  topReactions?: { reaction: string; count: number }[];
  reactionUsers?: { username: string; profileImageUrl: string; reactionType: string; timestamp: Date }[];
  showReactionUsers?: boolean;
}

export interface Comment {
  id: string;
  postId?: string;
  username: string;
  content: string;
  profileImageUrl?: string;
  imageUrl?: string;
  timestamp: Date;
  likes?: number;
  dislikes?: number;
  likedBy?: any[];
  replies?: Comment[];
  isEditing?: boolean;
  editText?: string;
  isLikedByCurrentUser?: boolean;
  isDisliked?: boolean;
  editHistory?: {
    text: string;
    editedBy: string;
    timestamp: Date;
  }[];
  showReplyInput?: boolean;
  showLikedBy?: boolean;
  lastEditedBy?: string;
  replyText?: string;
  showReplies?: boolean;
}


