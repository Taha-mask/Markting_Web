import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TinchatComponent } from './tinchat.component';

describe('TinchatComponent', () => {
  let component: TinchatComponent;
  let fixture: ComponentFixture<TinchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TinchatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TinchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
