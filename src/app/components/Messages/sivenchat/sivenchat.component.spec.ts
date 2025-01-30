import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SivenchatComponent } from './sivenchat.component';

describe('SivenchatComponent', () => {
  let component: SivenchatComponent;
  let fixture: ComponentFixture<SivenchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SivenchatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SivenchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
