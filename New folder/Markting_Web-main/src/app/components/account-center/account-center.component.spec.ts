<<<<<<< HEAD
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCenterComponent } from './account-center.component';

describe('AccountCenterComponent', () => {
  let component: AccountCenterComponent;
  let fixture: ComponentFixture<AccountCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountCenterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
=======
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCenterComponent } from './account-center.component';

describe('AccountCenterComponent', () => {
  let component: AccountCenterComponent;
  let fixture: ComponentFixture<AccountCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountCenterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
>>>>>>> 8148079b180250d0bca48214da621ca2b89d5e1a
