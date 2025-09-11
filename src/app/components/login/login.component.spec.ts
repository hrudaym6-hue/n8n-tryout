import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthenticationService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthenticationService', ['login']);
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: AuthenticationService, useValue: authService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create login form', () => {
    expect(component.loginForm).toBeTruthy();
  });

  it('should show error on invalid login', () => {
    authService.login.and.returnValue(throwError(() => new Error()));
    component.loginForm.setValue({username: 'foo', password: 'bar'});
    component.onSubmit();
    expect(component.error).toBe('Invalid username or password');
  });

  it('should navigate on successful login', () => {
    authService.login.and.returnValue(of(true));
    spyOn(component['router'], 'navigate');
    component.loginForm.setValue({username: 'foo', password: 'bar'});
    component.onSubmit();
    expect(component['router'].navigate).toHaveBeenCalledWith(['/menu']);
  });
});

