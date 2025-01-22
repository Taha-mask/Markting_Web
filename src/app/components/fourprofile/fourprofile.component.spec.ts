import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourprofileComponent } from './fourprofile.component';

describe('FourprofileComponent', () => {
  let component: FourprofileComponent;
  let fixture: ComponentFixture<FourprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FourprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FourprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
