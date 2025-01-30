import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SivenprofileComponent } from './sivenprofile.component';

describe('SivenprofileComponent', () => {
  let component: SivenprofileComponent;
  let fixture: ComponentFixture<SivenprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SivenprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SivenprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
