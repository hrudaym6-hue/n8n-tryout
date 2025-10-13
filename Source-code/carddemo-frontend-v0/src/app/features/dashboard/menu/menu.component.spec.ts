import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from './menu.component';
import { AuthService, User } from '../../../core/services/auth.service';
import { of } from 'rxjs';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      currentUserValue: { userId: 'TEST01', firstName: 'Test', lastName: 'User', userType: 'U' } as User
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ MenuComponent ],
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
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user name on init', () => {
    expect(component.userName).toBe('Test User');
  });

  it('should navigate to accounts when option 1 is selected', () => {
    component.selectedOption = '1';
    component.onSubmit();
    expect(router.navigate).toHaveBeenCalledWith(['/accounts']);
  });

  it('should show error for invalid option', () => {
    component.selectedOption = '9';
    component.onSubmit();
    expect(component.errorMessage).toContain('valid option number');
  });

  it('should show error when no option is selected', () => {
    component.selectedOption = '';
    component.onSubmit();
    expect(component.errorMessage).toContain('valid option number');
  });

  it('should logout and navigate to login on sign off', () => {
    component.onSignOff();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
