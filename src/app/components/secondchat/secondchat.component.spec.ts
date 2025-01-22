import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondchatComponent } from './secondchat.component';

describe('SecondchatComponent', () => {
  let component: SecondchatComponent;
  let fixture: ComponentFixture<SecondchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondchatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
