import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NinechatComponent } from './ninechat.component';

describe('NinechatComponent', () => {
  let component: NinechatComponent;
  let fixture: ComponentFixture<NinechatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NinechatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NinechatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
