import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstprofileComponent } from './firstprofile.component';

describe('FirstprofileComponent', () => {
  let component: FirstprofileComponent;
  let fixture: ComponentFixture<FirstprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
