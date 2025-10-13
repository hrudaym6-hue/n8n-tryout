import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpy = {
      snapshot: { queryParams: {} }
    };

    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should validate userId field as required', () => {
    const userId = component.loginForm.controls['userId'];
    expect(userId.valid).toBeFalsy();
    expect(userId.errors?.['required']).toBeTruthy();
  });

  it('should validate password field as required', () => {
    const password = component.loginForm.controls['password'];
    expect(password.valid).toBeFalsy();
    expect(password.errors?.['required']).toBeTruthy();
  });

  it('should call authService.login on submit with valid form', () => {
    const mockResponse = {
      token: 'test-token',
      user: { userId: 'TEST01', firstName: 'Test', lastName: 'User', userType: 'U' }
    };
    authService.login.and.returnValue(of(mockResponse));

    component.loginForm.setValue({ userId: 'TEST01', password: 'password' });
    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith('TEST01', 'password');
  });

  it('should navigate to admin menu for admin user', () => {
    const mockResponse = {
      token: 'test-token',
      user: { userId: 'ADMIN1', firstName: 'Admin', lastName: 'User', userType: 'A' }
    };
    authService.login.and.returnValue(of(mockResponse));

    component.loginForm.setValue({ userId: 'ADMIN1', password: 'password' });
    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/admin/menu']);
  });

  it('should show error message on login failure', () => {
    authService.login.and.returnValue(
      throwError(() => ({ error: { error: 'Invalid credentials' } }))
    );

    component.loginForm.setValue({ userId: 'TEST01', password: 'wrong' });
    component.onSubmit();

    expect(component.errorMessage).toBe('Invalid credentials');
    expect(component.loading).toBeFalsy();
  });

  it('should clear form when onClear is called', () => {
    component.loginForm.setValue({ userId: 'TEST01', password: 'password' });
    component.errorMessage = 'Some error';
    component.submitted = true;

    component.onClear();

    expect(component.loginForm.value).toEqual({ userId: null, password: null });
    expect(component.errorMessage).toBe('');
    expect(component.submitted).toBeFalsy();
  });
});
