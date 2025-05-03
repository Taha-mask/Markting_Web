export interface PostComment {
  id: string;
  username: string;
  text: string;
  imageUrl?: string;
  likes: number;
  likedBy: { username: string; profileImageUrl: string; }[];
  timestamp: Date;
  profileImageUrl: string;
  replies?: PostComment[];
  showReplyInput?: boolean;
  parentId?: string;
  replyText?: string;
  showLikedBy?: boolean;
  isEditing?: boolean;
  editText?: string;
  editHistory?: { text: string; editedBy: string; timestamp: Date }[];
  lastEditedBy?: string;
  isLikedByCurrentUser?: boolean;
}
