import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NinthprofileComponent } from './ninthprofile.component';

describe('NinthprofileComponent', () => {
  let component: NinthprofileComponent;
  let fixture: ComponentFixture<NinthprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NinthprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NinthprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
