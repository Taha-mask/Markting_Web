import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageComponent } from './message.component';

export class ModalComponent {
  toggleEmojiPicker() {
  throw new Error('Method not implemented.');
  }
  addEmoji($event: Event) {
  throw new Error('Method not implemented.');
  }}
describe('MessageComponent', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
