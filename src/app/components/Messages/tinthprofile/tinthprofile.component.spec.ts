import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TinthprofileComponent } from './tinthprofile.component';

describe('TinthprofileComponent', () => {
  let component: TinthprofileComponent;
  let fixture: ComponentFixture<TinthprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TinthprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TinthprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
