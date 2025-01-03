import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { By } from '@angular/platform-browser';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;

    // Set default notifications for testing
    component.notifications = [
      'Notification 1',
      'Notification 2',
      'Notification 3',
      'Notification 4'
    ];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle notifications dropdown', () => {
    expect(component.showNotifications).toBeFalse();

    component.toggleNotifications();
    expect(component.showNotifications).toBeTrue();

    component.toggleNotifications();
    expect(component.showNotifications).toBeFalse();
  });

  it('should display four default notifications', () => {
    expect(component.notifications.length).toBe(4);
    expect(component.notifications).toEqual([
      'Notification 1',
      'Notification 2',
      'Notification 3',
      'Notification 4'
    ]);
  });

  it('should show dropdown when showNotifications is true', () => {
    component.showNotifications = true;
    fixture.detectChanges();

    const dropdown = fixture.debugElement.query(By.css('.dropdown-menu'));
    expect(dropdown).toBeTruthy();
    expect(dropdown.nativeElement.classList).toContain('show');
  });

  it('should hide dropdown when showNotifications is false', () => {
    component.showNotifications = false;
    fixture.detectChanges();

    const dropdown = fixture.debugElement.query(By.css('.dropdown-menu'));
    expect(dropdown).toBeFalsy();
  });
});
