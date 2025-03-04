export interface Comment {
  username: string;
  text: string;
  imageUrl?: string; // Add this property
  likes: number;
  likedBy: string[];
  timestamp: Date;
  profileImageUrl: string;
}
