import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedComponent } from './feed.component';


export class ModalComponent {
  toggleEmojiPicker() {
  throw new Error('Method not implemented.');
  }
  addEmoji($event: Event) {
  throw new Error('Method not implemented.');
  }}

describe('FeedComponent', () => {
  let component: FeedComponent;
  let fixture: ComponentFixture<FeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedComponent]
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
    const initialLikes = component.posts[0].likes;
    component.toggleLike(component.posts[0]);
    expect(component.posts[0].likes).toBe(initialLikes + 1);
    expect(component.posts[0].liked).toBeTrue();
  });

  it('should toggle comments', () => {
    component.toggleComments(component.posts[0]);
    expect(component.posts[0].showComments).toBeTrue();
  });

  it('should toggle save', () => {
    component.toggleSave(component.posts[0]);
    expect(component.posts[0].saved).toBeTruthy();
  });
  it('should toggle Follow', () => {
    component.toggleFollow(component.usersFol[0]);
    expect(component.usersFol[0].Follow).toBeTrue();
  });
});
