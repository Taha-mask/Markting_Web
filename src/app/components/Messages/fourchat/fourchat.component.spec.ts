import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourchatComponent } from './fourchat.component';

describe('FourchatComponent', () => {
  let component: FourchatComponent;
  let fixture: ComponentFixture<FourchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FourchatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FourchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
