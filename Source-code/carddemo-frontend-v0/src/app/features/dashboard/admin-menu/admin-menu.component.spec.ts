import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminMenuComponent } from './admin-menu.component';
import { AuthService, User } from '../../../core/services/auth.service';

describe('AdminMenuComponent', () => {
  let component: AdminMenuComponent;
  let fixture: ComponentFixture<AdminMenuComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      currentUserValue: { userId: 'ADMIN1', firstName: 'Admin', lastName: 'User', userType: 'A' } as User
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ AdminMenuComponent ],
      imports: [ FormsModule ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display admin user name on init', () => {
    expect(component.userName).toBe('Admin User');
  });

  it('should navigate to user list when option 1 is selected', () => {
    component.selectedOption = '1';
    component.onSubmit();
    expect(router.navigate).toHaveBeenCalledWith(['/admin/users']);
  });

  it('should show error for invalid option', () => {
    component.selectedOption = '9';
    component.onSubmit();
    expect(component.errorMessage).toContain('valid option number');
  });
});
