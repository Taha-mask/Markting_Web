import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SavedPostComponent } from './saved-post.component';

describe('SavedPostComponent', () => {
  let component: SavedPostComponent;
  let fixture: ComponentFixture<SavedPostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SavedPostComponent]
    });
    fixture = TestBed.createComponent(SavedPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
