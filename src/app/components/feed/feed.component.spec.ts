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
    const initialLikes = component.samplePosts[0].likes;
    component.toggleLike(component.samplePosts[0]);
    expect(component.samplePosts[0].likes).toBe(initialLikes + 1);
    expect(component.samplePosts[0].liked).toBeTrue();
  });

  it('should toggle comments', () => {
    component.toggleComments(component.samplePosts[0]);
    expect(component.samplePosts[0].showComments).toBeTrue();
  });

  it('should toggle save', () => {
    component.toggleSave(component.samplePosts[0]);
    expect(component.samplePosts[0].saved).toBeTruthy();
  });
  it('should toggle Follow', () => {
    component.toggleFollow(component.usersFol[0]);
    expect(component.usersFol[0].Follow).toBeTrue();
  });
});