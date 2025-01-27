import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdprofileComponent } from './thirdprofile.component';

describe('ThirdprofileComponent', () => {
  let component: ThirdprofileComponent;
  let fixture: ComponentFixture<ThirdprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThirdprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
