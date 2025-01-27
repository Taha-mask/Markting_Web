import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondprofileComponent } from './secondprofile.component';

describe('SecondprofileComponent', () => {
  let component: SecondprofileComponent;
  let fixture: ComponentFixture<SecondprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
