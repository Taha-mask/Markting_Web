import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile-as-visitor.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        BrowserAnimationsModule,
        PickerModule
      ],
      declarations: []
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Profile Image Tests
  describe('Profile Image', () => {
    it('should update profile image when valid file is selected', () => {
      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const event = { target: { files: [mockFile] } } as any;
      component.onProfileImageChange(event);
      expect(component.showImagePreview).toBeTruthy();
    });

    it('should not update profile image for invalid file type', () => {
      const mockFile = new File([''], 'test.txt', { type: 'text/plain' });
      const event = { target: { files: [mockFile] } } as any;
      spyOn(window, 'alert');
      component.onProfileImageChange(event);
      expect(window.alert).toHaveBeenCalledWith('Only images are supported.');
    });
  });

  // Bio Tests
  describe('Bio Management', () => {
    it('should toggle bio edit mode', () => {
      component.isEditingBio = false;
      component.toggleBioEdit();
      expect(component.isEditingBio).toBeTruthy();
      component.toggleBioEdit();
      expect(component.isEditingBio).toBeFalsy();
    });

    it('should save bio and exit edit mode', () => {
      component.isEditingBio = true;
      component.bio = 'New Bio Text';
      component.saveBio();
      expect(component.isEditingBio).toBeFalsy();
      expect(component.bio).toBe('New Bio Text');
    });
  });

  // Skills Tests
  describe('Skills Management', () => {
    it('should add new skill', () => {
      const initialLength = component.skills.length;
      component.addSkill('New Skill');
      expect(component.skills.length).toBe(initialLength + 1);
      expect(component.skills).toContain('New Skill');
    });

    it('should not add duplicate skill', () => {
      component.skills = ['Existing Skill'];
      component.addSkill('Existing Skill');
      expect(component.skills.length).toBe(1);
    });

    it('should remove skill', () => {
      component.skills = ['Skill 1', 'Skill 2'];
      component.removeSkill(0);
      expect(component.skills.length).toBe(1);
      expect(component.skills[0]).toBe('Skill 2');
    });
  });

  // Portfolio Tests
  describe('Portfolio Management', () => {
    it('should filter portfolio items by category', () => {
      component.selectedPortfolioCategory = 'All';
      component.filterPortfolio('Social Media');
      expect(component.selectedPortfolioCategory).toBe('Social Media');
    });

    it('should toggle portfolio view', () => {
      component.portfolioView = 'grid';
      component.togglePortfolioView();
      expect(component.portfolioView).toBe('list');
      component.togglePortfolioView();
      expect(component.portfolioView).toBe('grid');
    });
  });

  // Analytics Tests
  describe('Analytics', () => {
    it('should toggle analytics visibility', () => {
      component.showAnalytics = false;
      component.toggleAnalytics();
      expect(component.showAnalytics).toBeTruthy();
      component.toggleAnalytics();
      expect(component.showAnalytics).toBeFalsy();
    });

    it('should track profile views', () => {
      const initialViews = component.analytics.profileViews;
      component.ngOnInit();
      expect(component.analytics.profileViews).toBe(initialViews + 1);
    });
  });

  // Availability Tests
  describe('Availability Management', () => {
    it('should update availability status', () => {
      component.updateAvailability('Busy');
      expect(component.availability.status).toBe('Busy');
    });

    it('should toggle availability edit mode', () => {
      component.isEditingAvailability = false;
      component.toggleAvailabilityEdit();
      expect(component.isEditingAvailability).toBeTruthy();
    });

    it('should save availability and exit edit mode', () => {
      component.isEditingAvailability = true;
      component.saveAvailability();
      expect(component.isEditingAvailability).toBeFalsy();
    });
  });

  // Testimonials Tests
  describe('Testimonials', () => {
    it('should add new testimonial and update average rating', () => {
      const initialCount = component.testimonials.length;
      const newTestimonial = {
        content: 'Great work!',
        author: 'John Doe',
        company: 'Test Corp',
        rating: 5,
        date: '2024-03-16'
      };
      component.addTestimonial(newTestimonial);
      expect(component.testimonials.length).toBe(initialCount + 1);
      expect(component.analytics.averageRating).toBeGreaterThan(0);
    });
  });

  // Certifications Tests
  describe('Certifications', () => {
    it('should add new certification', () => {
      const initialCount = component.certifications.length;
      const newCert = {
        name: 'Test Cert',
        issuer: 'Test Issuer',
        date: '2024',
        credentialUrl: 'https://test.com'
      };
      component.addCertification(newCert);
      expect(component.certifications.length).toBe(initialCount + 1);
    });

    it('should remove certification', () => {
      component.certifications = [{
        name: 'Test Cert',
        issuer: 'Test Issuer',
        date: '2024'
      }];
      component.removeCertification(0);
      expect(component.certifications.length).toBe(0);
    });
  });

  // Achievements Tests
  describe('Achievements', () => {
    it('should add new achievement', () => {
      const initialCount = component.achievements.length;
      const newAchievement = {
        title: 'Test Achievement',
        date: '2024',
        description: 'Test Description',
        icon: 'trophy',
        category: 'Award'
      };
      expect(component.achievements.length).toBe(initialCount + 1);
    });

    it('should remove achievement', () => {
      const initialCount = component.achievements.length;
      component.removeAchievement(0);
      expect(component.achievements.length).toBe(initialCount - 1);
    });
  });
});
