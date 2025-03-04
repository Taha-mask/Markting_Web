import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FivechatComponent } from './fivechat.component';

describe('FivechatComponent', () => {
  let component: FivechatComponent;
  let fixture: ComponentFixture<FivechatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FivechatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FivechatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
