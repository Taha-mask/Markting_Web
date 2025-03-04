import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EighthprofileComponent } from './eighthprofile.component';

describe('EighthprofileComponent', () => {
  let component: EighthprofileComponent;
  let fixture: ComponentFixture<EighthprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EighthprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EighthprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
