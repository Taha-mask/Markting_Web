import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupMarketerComponent } from './signup-marketer.component';

describe('SignupMarketerComponent', () => {
  let component: SignupMarketerComponent;
  let fixture: ComponentFixture<SignupMarketerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupMarketerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupMarketerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
