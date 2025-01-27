import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiveprofileComponent } from './fiveprofile.component';

describe('FiveprofileComponent', () => {
  let component: FiveprofileComponent;
  let fixture: ComponentFixture<FiveprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiveprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiveprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
