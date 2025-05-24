import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedComponent } from './feed.component';
import { PostService } from '../../services/post.service';
import { of } from 'rxjs';

export class ModalComponent {
  toggleEmojiPicker() {
    throw new Error('Method not implemented.');
  }
  addEmoji($event: Event) {
    throw new Error('Method not implemented.');
  }
}

describe('FeedComponent', () => {
  let component: FeedComponent;
  let fixture: ComponentFixture<FeedComponent>;
  let postService: jasmine.SpyObj<PostService>;

  beforeEach(async () => {
    postService = jasmine.createSpyObj('PostService', ['getPosts']);
    postService.getPosts.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [FeedComponent],
      providers: [
        { provide: PostService, useValue: postService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle like', () => {
    // Setup a test post
    const testPost = {
      id: '1',
      content: 'Test post',
      username: 'testuser',
      profileImageUrl: 'test.jpg',
      timestamp: new Date(),
      likes: 0,
      liked: false,
      comments: [],
      showComments: false,
      saved: false,
      topReactions: [],
      reactionUsers: []
    };
    
    // Add test post to component posts
    component.posts = [testPost];
    component.filteredPosts = [testPost];
    
    // Use non-null assertion to ensure TypeScript knows this value exists
    const initialLikes = component.posts[0].likes || 0;
    component.toggleLike(component.posts[0]);
    expect(component.posts[0].likes).toBe(initialLikes + 1);
    expect(component.posts[0].liked).toBeTrue();
  });

  it('should toggle comments', () => {
    // Setup a test post
    const testPost = {
      id: '1',
      content: 'Test post',
      username: 'testuser',
      profileImageUrl: 'test.jpg',
      timestamp: new Date(),
      likes: 0,
      liked: false,
      comments: [],
      showComments: false,
      saved: false,
      topReactions: [],
      reactionUsers: []
    };
    
    // Add test post to component posts
    component.posts = [testPost];
    component.filteredPosts = [testPost];
    
    component.toggleComments(component.posts[0]);
    expect(component.posts[0].showComments).toBeTrue();
  });

  it('should toggle save', () => {
    // Setup a test post
    const testPost = {
      id: '1',
      content: 'Test post',
      username: 'testuser',
      profileImageUrl: 'test.jpg',
      timestamp: new Date(),
      likes: 0,
      liked: false,
      comments: [],
      showComments: false,
      saved: false,
      topReactions: [],
      reactionUsers: []
    };
    
    // Add test post to component posts
    component.posts = [testPost];
    component.filteredPosts = [testPost];
    
    component.toggleSave(component.posts[0]);
    expect(component.posts[0].saved).toBeTruthy();
  });
  it('should toggle Follow', () => {
    // Setup a test user with the correct structure
    const testUser = {
      name: 'testuser',
      title: 'Test User',
      img: 'test.jpg',
      Follow: false
    };
    
    // Add test user to component usersFol
    component.usersFol = [testUser];
    
    component.toggleFollow(component.usersFol[0]);
    expect(component.usersFol[0].Follow).toBeTrue();
  });
});