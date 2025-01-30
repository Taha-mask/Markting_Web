import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SixprofileComponent } from './sixprofile.component';

describe('SixprofileComponent', () => {
  let component: SixprofileComponent;
  let fixture: ComponentFixture<SixprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SixprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SixprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
