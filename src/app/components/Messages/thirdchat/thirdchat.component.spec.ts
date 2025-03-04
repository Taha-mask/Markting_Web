import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdchatComponent } from './thirdchat.component';

describe('ThirdchatComponent', () => {
  let component: ThirdchatComponent;
  let fixture: ComponentFixture<ThirdchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdchatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThirdchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
