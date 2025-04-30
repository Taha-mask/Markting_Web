export interface User {
  id: string;
  username: string;
  type: string;
  role: string;
  profileImageUrl: string;
  status: string;
  isFollowing?: boolean;
}
