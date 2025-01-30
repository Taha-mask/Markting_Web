import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SixchatComponent } from './sixchat.component';

describe('SixchatComponent', () => {
  let component: SixchatComponent;
  let fixture: ComponentFixture<SixchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SixchatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SixchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
