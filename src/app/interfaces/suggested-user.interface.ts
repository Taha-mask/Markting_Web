export interface SuggestedUser {
  id: string;
  username: string;
  type: string;
  profileImageUrl: string;
  status: 'Online' | 'Offline' | 'Away';
  role: 'user' | 'admin' | 'moderator';
  isFollowing: boolean;
  rating?: number;
  followersCount?: number;
  lastActive?: Date;
  bio?: string;
  location?: string;
  skills?: string[];
}
