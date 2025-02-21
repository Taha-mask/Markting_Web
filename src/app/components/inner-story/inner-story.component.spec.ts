import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerStoryComponent } from './inner-story.component';

describe('InnerStoryComponent', () => {
  let component: InnerStoryComponent;
  let fixture: ComponentFixture<InnerStoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InnerStoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InnerStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
