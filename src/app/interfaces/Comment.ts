
export interface Comment {
  username: string;
  text: string;
  imageUrl?: string;
  likes: number;
  likedBy: string[];
  timestamp: Date;
  profileImageUrl: string;
}
