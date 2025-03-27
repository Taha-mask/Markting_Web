import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ReactiveFormsModule, 
  FormBuilder, 
  FormGroup, 
  Validators, 
  AbstractControl, 
  ValidationErrors 
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReplacePipe } from '../../pipes/highlight.pipe';

interface SecurityActivity {
  id: number;
  type: 'login' | 'password_change' | 'two_factor' | 'device_management' | 'login_alerts' | 'connected_experiences' | 'profile_update' | 'profile_picture_update' | 'notification_settings' | 'privacy_settings' | 'billing_settings';
  timestamp: Date;
  details: {
    location?: string;
    device?: string;
    ip?: string;
  };
  severity: 'low' | 'medium' | 'high';
}

interface ConnectedDevice {
  id: string;
  type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  lastActive: Date;
  location: string;
  ipAddress: string;
}

interface ConnectedExperience {
  id: number;
  platform: string;
  connectionStatus: 'connected' | 'disconnected';
  connectedAt: Date;
  permissions: string[];
  profileLink?: string;
}

interface UserProfile {
  username: string;
  fullName: string;
  email: string;
  profilePicture: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  
  phoneNumber?: string;
  bio?: string;
  location?: string;
  joinDate?: Date;
  interests?: string[];
  skills?: string[];

  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };

  privacySettings?: {
    profileVisibility: 'public' | 'friends' | 'private';
    emailVisibility: 'public' | 'private';
    phoneVisibility: 'public' | 'private';
  };
}

interface UserProfileBento {
  username: string;
  fullName: string;
  email: string;
  profileImageUrl: string;
  followers: number;
  following: number;
  posts: number;
}

interface NotificationChannel {
  email: boolean;
  push: boolean;
  sms: boolean;
}

interface NotificationPreference {
  type: 'like' | 'comment' | 'follow' | 'mention' | 'message' | 'post_share';
  enabled: boolean;
  channels: NotificationChannel;
}

interface NotificationPreferenceBento {
  type: 'email' | 'push' | 'sms' | 'in_app';
  enabled: boolean;
}

interface NotificationSettings {
  generalNotifications: boolean;
  privacyMode: 'all' | 'following' | 'none';
  preferences: NotificationPreference[];
  quietHoursEnabled: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

interface NotificationSettingsBento {
  preferences: NotificationPreferenceBento[];
}

interface RecentSecurityActivity {
  type: SecurityActivity['type'];
  timestamp: Date;
}

type PrivacyControlType = 'profile_visibility' | 'contact_info' | 'post_visibility' | 'search_visibility' | 'data_sharing';
type PrivacyLevel = 'public' | 'friends' | 'private';

interface PrivacyControl {
  type: PrivacyControlType;
  level: PrivacyLevel;
}

interface DataPrivacy {
  allowDataCollection: boolean;
  allowPersonalizedAds: boolean;
  shareDataWithThirdParties: boolean;
}

interface PrivacySettings {
  controls: PrivacyControl[];
  dataPrivacy: DataPrivacy;
  blockedUsers: {
    id: number;
    username: string;
    blockedAt: Date;
  }[];
  accountPrivacy: {
    profileLock: boolean;
    activeStatus: 'all' | 'contacts' | 'none';
  };
}

interface Subscription {
  id: number;
  type: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'expired' | 'pending';
  startDate: Date;
  endDate: Date;
  price: number;
  features: string[];
}

interface PaymentMethod {
  id: number;
  type: 'credit_card' | 'paypal' | 'bank_transfer';
  lastFourDigits?: string;
  cardType?: 'visa' | 'mastercard' | 'amex' | 'discover';
  isDefault: boolean;
}

interface BillingHistory {
  id: number;
  date: Date;
  amount: number;
  description: string;
  status: 'paid' | 'pending' | 'failed';
  invoiceUrl?: string;
}

interface BillingSettings {
  currentSubscription: Subscription;
  paymentMethods: PaymentMethod[];
  billingHistory: BillingHistory[];
  billingEmail: string;
  autoRenew: boolean;
}

interface ProfileCompletionItem {
  type: 'personal_info' | 'professional_info' | 'social_links' | 'profile_picture' | 'bio';
  completed: boolean;
}

interface ProfileRecommendation {
  type: 'connection' | 'skill' | 'interest' | 'content';
  message: string;
}

@Component({
  selector: 'app-account-center',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FormsModule, 
    HttpClientModule,
    ReplacePipe
  ],
  templateUrl: './account-center.component.html',
  styleUrls: ['./account-center.component.css']
})
export class AccountCenterComponent implements OnInit {
  passwordForm!: FormGroup;
  privacyForm!: FormGroup;
  notificationForm!: FormGroup;

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  securityActivities: SecurityActivity[] = [];
  connectedDevices: ConnectedDevice[] = [];
  connectedExperiences: ConnectedExperience[] = [
    {
      id: 1,
      platform: 'Google',
      connectionStatus: 'connected',
      connectedAt: new Date('2024-01-15'),
      permissions: ['profile', 'email', 'basic_info'],
      profileLink: 'https://myaccount.google.com'
    },
    {
      id: 2,
      platform: 'Facebook',
      connectionStatus: 'disconnected',
      connectedAt: new Date('2023-11-20'),
      permissions: []
    },
    {
      id: 3,
      platform: 'LinkedIn',
      connectionStatus: 'connected',
      connectedAt: new Date('2024-02-10'),
      permissions: ['profile', 'connections'],
      profileLink: 'https://www.linkedin.com/in/username'
    }
  ];

  twoFactorEnabled = false;
  loginAlerts = false;
  privacyLevel: 'strict' | 'moderate' | 'relaxed' = 'moderate';
  darkMode = false;

  currentUser = 'Taha Mahmoud';
  currentUserEmail = 'taha.mahmoud@example.com';
  currentUserAvatar = 'images/user-1.png';

  userProfile: UserProfile = {
    username: 'taha_mahmoud',
    fullName: 'Taha Mahmoud',
    email: 'taha.mahmoud@example.com',
    profilePicture: 'images/user-1.png',
    followersCount: 1245,
    followingCount: 567,
    postsCount: 89,

    phoneNumber: '+20 123 456 7890',
    bio: 'Passionate software engineer focused on web technologies and user experience design.',
    location: 'Cairo, Egypt',
    joinDate: new Date('2023-01-15'),
    interests: ['Web Development', 'UI/UX Design', 'Machine Learning', 'Open Source'],
    skills: ['Angular', 'TypeScript', 'Node.js', 'Python', 'Docker'],

    socialLinks: {
      linkedin: 'https://linkedin.com/in/tahamahmoud',
      twitter: 'https://twitter.com/tahadev',
      github: 'https://github.com/tahamahmoud',
      website: 'https://tahaportfolio.com'
    },

    privacySettings: {
      profileVisibility: 'friends',
      emailVisibility: 'private',
      phoneVisibility: 'private'
    }
  };

  userProfileBento: UserProfileBento = {
    username: 'johndoe',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    profileImageUrl: 'assets/images/default-avatar.png',
    followers: 1245,
    following: 567,
    posts: 89
  };

  notificationSettings: NotificationSettings = {
    generalNotifications: true,
    privacyMode: 'following',
    quietHoursEnabled: false,
    preferences: [
      {
        type: 'like',
        enabled: true,
        channels: {
          email: true,
          push: true,
          sms: false
        }
      },
      {
        type: 'comment',
        enabled: true,
        channels: {
          email: true,
          push: true,
          sms: false
        }
      },
      {
        type: 'follow',
        enabled: true,
        channels: {
          email: false,
          push: true,
          sms: false
        }
      },
      {
        type: 'mention',
        enabled: true,
        channels: {
          email: true,
          push: true,
          sms: false
        }
      },
      {
        type: 'message',
        enabled: true,
        channels: {
          email: true,
          push: true,
          sms: false
        }
      },
      {
        type: 'post_share',
        enabled: false,
        channels: {
          email: false,
          push: false,
          sms: false
        }
      }
    ]
  };

  notificationSettingsBento: NotificationSettingsBento = {
    preferences: [
      { type: 'email', enabled: true },
      { type: 'push', enabled: true },
      { type: 'sms', enabled: false },
      { type: 'in_app', enabled: true }
    ]
  };

  recentSecurityActivities: RecentSecurityActivity[] = [
    {
      type: 'login',
      timestamp: new Date('2024-03-15T10:30:00')
    },
    {
      type: 'password_change',
      timestamp: new Date('2024-02-28T14:45:00')
    },
    {
      type: 'profile_update',
      timestamp: new Date('2024-02-20T09:15:00')
    }
  ];

  privacySettings: PrivacySettings = {
    controls: [
      {
        type: 'profile_visibility',
        level: 'friends'
      },
      {
        type: 'contact_info',
        level: 'private'
      },
      {
        type: 'post_visibility',
        level: 'friends'
      },
      {
        type: 'search_visibility',
        level: 'public'
      },
      {
        type: 'data_sharing',
        level: 'private'
      }
    ],
    dataPrivacy: {
      allowDataCollection: true,
      allowPersonalizedAds: false,
      shareDataWithThirdParties: false
    },
    blockedUsers: [
      {
        id: 1,
        username: 'spam_user1',
        blockedAt: new Date('2024-02-15')
      },
      {
        id: 2,
        username: 'troll_account',
        blockedAt: new Date('2024-03-10')
      }
    ],
    accountPrivacy: {
      profileLock: false,
      activeStatus: 'contacts'
    }
  };

  billingSettings: BillingSettings = {
    currentSubscription: {
      id: 1,
      type: 'free',
      status: 'active',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      price: 0,
      features: [
        'Basic Profile',
        'Limited Posts',
        'Community Access'
      ]
    },
    paymentMethods: [
      {
        id: 1,
        type: 'credit_card',
        lastFourDigits: '4321',
        cardType: 'visa',
        isDefault: true
      }
    ],
    billingHistory: [
      {
        id: 1,
        date: new Date('2024-01-15'),
        amount: 0,
        description: 'Free Tier Subscription',
        status: 'paid'
      }
    ],
    billingEmail: 'user@example.com',
    autoRenew: true
  };

  profileCompletionItems: ProfileCompletionItem[] = [
    {
      type: 'personal_info',
      completed: true
    },
    {
      type: 'professional_info',
      completed: false
    },
    {
      type: 'social_links',
      completed: true
    },
    {
      type: 'profile_picture',
      completed: true
    },
    {
      type: 'bio',
      completed: true
    }
  ];

  profileRecommendations: ProfileRecommendation[] = [
    {
      type: 'connection',
      message: 'Connect with friends and colleagues'
    },
    {
      type: 'skill',
      message: 'Add your skills and expertise'
    },
    {
      type: 'interest',
      message: 'Showcase your interests and hobbies'
    },
    {
      type: 'content',
      message: 'Share your content and creations'
    }
  ];

  @ViewChild('changePasswordModal') changePasswordModal!: ElementRef;

  private activityIconMap = {
    'login': 'bi bi-box-arrow-in-right',
    'password_change': 'bi bi-key',
    'two_factor': 'bi bi-shield-lock',
    'device_management': 'bi bi-laptop',
    'login_alerts': 'bi bi-bell',
    'connected_experiences': 'bi bi-link',
    'profile_update': 'bi bi-person-circle',
    'profile_picture_update': 'bi bi-image',
    'notification_settings': 'bi bi-gear',
    'privacy_settings': 'bi bi-eye',
    'billing_settings': 'bi bi-credit-card'
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForms();
    this.loadSecurityData();
    this.loadDarkModePreference();
  }

  initializeForms() {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [
        Validators.required, 
        Validators.minLength(8),
        this.passwordStrengthValidator
      ]],
      newPassword: ['', [
        Validators.required, 
        Validators.minLength(12),
        this.passwordStrengthValidator
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { 
      validators: [
        this.passwordMatchValidator,
        this.passwordDifferentValidator
      ] 
    });

    this.privacyForm = this.fb.group({
      profileVisibility: ['friends', Validators.required],
      dataSharing: [false],
      activityTracking: [true]
    });

    this.notificationForm = this.fb.group({
      emailNotifications: this.fb.group({
        comments: [true],
        likes: [true],
        newFollowers: [false]
      }),
      pushNotifications: this.fb.group({
        messages: [true],
        updates: [false]
      })
    });
  }

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
    
    const passwordValid = hasUpperCase && hasLowerCase && 
                         hasNumber && hasSpecialChar;
    
    return passwordValid ? null : { 
      passwordStrength: { 
        requiredStrength: 'Must include uppercase, lowercase, number, and special character' 
      } 
    };
  }

  passwordMatchValidator(group: FormGroup): ValidationErrors | null {
    const newPassword = group.get('newPassword');
    const confirmPassword = group.get('confirmPassword');
    return newPassword && confirmPassword && newPassword.value === confirmPassword.value 
      ? null : { passwordMismatch: true };
  }

  passwordDifferentValidator(group: FormGroup): ValidationErrors | null {
    const currentPassword = group.get('currentPassword');
    const newPassword = group.get('newPassword');
    return currentPassword && newPassword && currentPassword.value !== newPassword.value 
      ? null : { passwordNotChanged: true };
  }

  togglePasswordVisibility(type: 'current' | 'new' | 'confirm') {
    switch(type) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  loadSecurityData() {
    this.securityActivities = this.generateMockSecurityActivities();
    this.connectedDevices = this.generateMockConnectedDevices();
  }

  generateMockSecurityActivities(): SecurityActivity[] {
    return [
      {
        id: 1,
        type: 'login',
        timestamp: new Date(),
        details: {
          location: 'New York, USA',
          device: 'Chrome, Windows 10',
          ip: '192.168.1.100'
        },
        severity: 'low'
      },
      {
        id: 2,
        type: 'password_change',
        timestamp: new Date('2024-03-15'),
        details: {
          location: 'San Francisco, USA',
          device: 'Safari, MacOS',
          ip: '10.0.0.50'
        },
        severity: 'high'
      }
    ];
  }

  generateMockConnectedDevices(): ConnectedDevice[] {
    return [
      {
        id: 'device_1',
        type: 'desktop',
        browser: 'Chrome',
        os: 'Windows 10',
        lastActive: new Date(),
        location: 'New York',
        ipAddress: '192.168.1.100'
      },
      {
        id: 'device_2',
        type: 'mobile',
        browser: 'Safari',
        os: 'iOS 14',
        lastActive: new Date('2024-03-20'),
        location: 'San Francisco',
        ipAddress: '10.0.0.50'
      }
    ];
  }

  changePassword() {
    if (this.passwordForm.valid) {
      console.log('Password change attempted', this.passwordForm.value);
      this.addSecurityActivity('password_change' as SecurityActivity['type'], 'high');
      
      // Close the modal using Bootstrap's Modal method
      if (this.changePasswordModal) {
        const modalElement = this.changePasswordModal.nativeElement;
        const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      }
      
      // Reset the form after successful password change
      this.passwordForm.reset();
    }
  }

  toggleTwoFactor() {
    this.twoFactorEnabled = !this.twoFactorEnabled;
    this.addSecurityActivity('two_factor' as SecurityActivity['type'], 'high');
  }

  toggleLoginAlerts() {
    this.loginAlerts = !this.loginAlerts;
    this.addSecurityActivity('login_alerts' as SecurityActivity['type'], 'medium');
  }

  removeDevice(device: ConnectedDevice) {
    this.connectedDevices = this.connectedDevices.filter(d => d.id !== device.id);
    this.addSecurityActivity('device_management' as SecurityActivity['type'], 'medium');
  }

  addSecurityActivity(type: SecurityActivity['type'], severity: SecurityActivity['severity']) {
    const newActivity: SecurityActivity = {
      id: this.securityActivities.length + 1,
      type: type,
      timestamp: new Date(),
      details: {},
      severity: severity
    };
    this.securityActivities.unshift(newActivity);
  }

  savePrivacySettings() {
    if (this.privacyForm.valid) {
      console.log('Privacy settings saved', this.privacyForm.value);
    }
  }

  saveNotificationSettings() {
    if (this.notificationForm.valid) {
      console.log('Notification settings saved', this.notificationForm.value);
    }
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    if (this.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', this.darkMode.toString());
  }

  loadDarkModePreference() {
    const darkModePref = localStorage.getItem('darkMode');
    if (darkModePref === 'true') {
      this.darkMode = true;
      document.body.classList.add('dark-mode');
    }
  }

  logout() {
    console.log('User logged out');
    // Add actual logout logic here (e.g., clear auth tokens, redirect to login page)
  }

  connectPlatform(platform: string) {
    const experience = this.connectedExperiences.find(exp => exp.platform === platform);
    if (experience) {
      experience.connectionStatus = experience.connectionStatus === 'connected' ? 'disconnected' : 'connected';
      this.addSecurityActivity('connected_experiences' as SecurityActivity['type'], 'medium');
    }
  }

  updateProfile(updatedProfile: Partial<UserProfile>) {
    // Merge the updated profile with existing profile
    this.userProfile = { ...this.userProfile, ...updatedProfile };
    
    // Log the profile update as a security activity
    this.addSecurityActivity('profile_update' as SecurityActivity['type'], 'low');
    
    // You might want to call a service to persist these changes
    console.log('Profile updated:', this.userProfile);
  }

  updateProfilePicture(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.userProfile.profilePicture = e.target.result as string;
          this.addSecurityActivity('profile_picture_update' as SecurityActivity['type'], 'low');
        }
      };
      reader.readAsDataURL(file);
    }
  }

  updateNotificationSettings(updatedSettings: Partial<NotificationSettings>) {
    // Merge the updated settings with existing settings
    this.notificationSettings = { ...this.notificationSettings, ...updatedSettings };
    
    // Log the notification settings update as a security activity
    this.addSecurityActivity('notification_settings' as SecurityActivity['type'], 'low');
    
    console.log('Notification settings updated:', this.notificationSettings);
  }

  toggleNotificationPreference(type: NotificationPreference['type']) {
    const preference = this.notificationSettings.preferences.find(pref => pref.type === type);
    if (preference) {
      preference.enabled = !preference.enabled;
      this.updateNotificationSettings({ preferences: this.notificationSettings.preferences });
    }
  }

  toggleNotificationChannel(type: NotificationPreference['type'], channel: keyof NotificationChannel) {
    const preference = this.notificationSettings.preferences.find(pref => pref.type === type);
    if (preference) {
      preference.channels[channel] = !preference.channels[channel];
      this.updateNotificationSettings({ preferences: this.notificationSettings.preferences });
    }
  }

  toggleQuietHours() {
    this.notificationSettings.quietHoursEnabled = !this.notificationSettings.quietHoursEnabled;
    this.updateNotificationSettings({
      quietHoursEnabled: this.notificationSettings.quietHoursEnabled
    });
  }

  updateQuietHoursStart(time: string) {
    this.updateNotificationSettings({ 
      quietHoursStart: time 
    });
  }

  updateQuietHoursEnd(time: string) {
    this.updateNotificationSettings({ 
      quietHoursEnd: time 
    });
  }

  updatePrivacySettings(updatedSettings: Partial<PrivacySettings>) {
    // Merge the updated settings with existing settings
    this.privacySettings = { ...this.privacySettings, ...updatedSettings };
    
    // Log the privacy settings update as a security activity
    this.addSecurityActivity('privacy_settings' as SecurityActivity['type'], 'medium');
    
    console.log('Privacy settings updated:', this.privacySettings);
  }

  togglePrivacyControl(type: PrivacyControlType, level: PrivacyLevel) {
    const controlIndex = this.privacySettings.controls.findIndex(
      control => control.type === type
    );
    
    if (controlIndex !== -1) {
      this.privacySettings.controls[controlIndex] = { 
        type, 
        level 
      };
      
      this.updatePrivacySettings({ 
        controls: this.privacySettings.controls 
      });
    }
  }

  getPrivacyControlLevel(type: PrivacyControlType): PrivacyLevel {
    const control = this.privacySettings.controls.find(c => c.type === type);
    return control ? control.level : 'private';
  }

  toggleDataPrivacy(setting: keyof DataPrivacy) {
    this.privacySettings.dataPrivacy[setting] = !this.privacySettings.dataPrivacy[setting];
    this.updatePrivacySettings({
      dataPrivacy: this.privacySettings.dataPrivacy
    });
  }

  unblockUser(userId: number) {
    this.privacySettings.blockedUsers = this.privacySettings.blockedUsers.filter(user => user.id !== userId);
    this.updatePrivacySettings({
      blockedUsers: this.privacySettings.blockedUsers
    });
  }

  toggleAccountPrivacy(setting: keyof PrivacySettings['accountPrivacy'], value?: PrivacySettings['accountPrivacy']['activeStatus']) {
    if (setting === 'profileLock') {
      this.privacySettings.accountPrivacy.profileLock = !this.privacySettings.accountPrivacy.profileLock;
    } else if (value) {
      this.privacySettings.accountPrivacy.activeStatus = value;
    }
    
    this.updatePrivacySettings({
      accountPrivacy: this.privacySettings.accountPrivacy
    });
  }

  updateAccountPrivacyStatus(status: 'all' | 'contacts' | 'none') {
    this.privacySettings.accountPrivacy.activeStatus = status;
    this.updatePrivacySettings({
      accountPrivacy: this.privacySettings.accountPrivacy
    });
  }

  updateBillingEmail(email: string) {
    this.billingSettings.billingEmail = email;
    this.addSecurityActivity('billing_settings' as SecurityActivity['type'], 'low');
  }

  toggleAutoRenew() {
    this.billingSettings.autoRenew = !this.billingSettings.autoRenew;
    this.addSecurityActivity('billing_settings' as SecurityActivity['type'], 'low');
  }

  upgradeSubscription(tier: Subscription['type']) {
    // Placeholder for subscription upgrade logic
    this.billingSettings.currentSubscription.type = tier;
    this.addSecurityActivity('billing_settings' as SecurityActivity['type'], 'medium');
  }

  addPaymentMethod(method: PaymentMethod) {
    // Set new method as default and remove previous default
    this.billingSettings.paymentMethods.forEach(m => m.isDefault = false);
    method.isDefault = true;
    this.billingSettings.paymentMethods.push(method);
    this.addSecurityActivity('billing_settings' as SecurityActivity['type'], 'medium');
  }

  removePaymentMethod(methodId: number) {
    this.billingSettings.paymentMethods = 
      this.billingSettings.paymentMethods.filter(m => m.id !== methodId);
    this.addSecurityActivity('billing_settings' as SecurityActivity['type'], 'low');
  }

  downloadInvoice(invoiceId: number) {
    const invoice = this.billingSettings.billingHistory.find(h => h.id === invoiceId);
    if (invoice && invoice.invoiceUrl) {
      // Placeholder for invoice download logic
      window.open(invoice.invoiceUrl, '_blank');
    }
  }

  getActivityIcon(type: SecurityActivity['type']): string {
    return this.activityIconMap[type] || 'bi bi-info-circle';
  }

  toggleNotificationPreferenceBento(type: NotificationPreferenceBento['type']) {
    const pref = this.notificationSettingsBento.preferences.find(p => p.type === type);
    if (pref) {
      pref.enabled = !pref.enabled;
      this.addSecurityActivity('notification_settings', 'low');
    }
  }

  navigateToProfileSection(sectionType: ProfileCompletionItem['type'] | ProfileRecommendation['type']) {
    // Map recommendation types to profile section types
    const sectionTypeMap: Record<ProfileRecommendation['type'], ProfileCompletionItem['type']> = {
      'connection': 'social_links',
      'skill': 'professional_info',
      'interest': 'professional_info',
      'content': 'personal_info'
    };

    // Determine the actual section type to navigate to
    const targetSection = this.profileCompletionItems.find(item => 
      item.type === sectionType || 
      sectionType === sectionTypeMap[sectionType as ProfileRecommendation['type']]
    )?.type || 'personal_info';

    // Implement navigation logic or open a modal for the specific section
    switch (targetSection) {
      case 'personal_info':
        // Open personal info edit modal or section
        console.log('Navigating to Personal Information');
        break;
      case 'professional_info':
        // Open skills and interests edit section
        console.log('Navigating to Professional Details');
        break;
      case 'social_links':
        // Open social connections section
        console.log('Navigating to Social Connections');
        break;
      case 'profile_picture':
        // Open profile picture upload section
        console.log('Navigating to Profile Picture');
        break;
      case 'bio':
        // Open bio editing section
        console.log('Navigating to Personal Bio');
        break;
      default:
        console.log(`Navigating to profile section: ${targetSection}`);
    }
  }
}