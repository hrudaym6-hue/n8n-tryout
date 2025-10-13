import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AccountListComponent } from './account-list.component';
import { AccountService } from '../../../core/services/account.service';

describe('AccountListComponent', () => {
  let component: AccountListComponent;
  let fixture: ComponentFixture<AccountListComponent>;
  let accountService: jasmine.SpyObj<AccountService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const accountServiceSpy = jasmine.createSpyObj('AccountService', ['getAccounts']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ AccountListComponent ],
      imports: [ FormsModule ],
      providers: [
        { provide: AccountService, useValue: accountServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    accountService = TestBed.inject(AccountService) as jasmine.SpyObj<AccountService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountListComponent);
    component = fixture.componentInstance;
    
    const mockResponse = {
      accounts: [
        { account_id: '0000000001', customer_id: '0000000001', first_name: 'John', last_name: 'Doe', 
          account_status: 'Y', credit_limit: 5000, cash_credit_limit: 1000, current_balance: 1234.56, email: 'john@example.com' }
      ],
      total: 1,
      page: 1,
      limit: 10
    };
    accountService.getAccounts.and.returnValue(of(mockResponse));
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load accounts on init', () => {
    expect(accountService.getAccounts).toHaveBeenCalled();
    expect(component.accounts.length).toBe(1);
  });

  it('should handle error when loading accounts fails', () => {
    accountService.getAccounts.and.returnValue(throwError(() => new Error('Failed')));
    component.loadAccounts();
    expect(component.errorMessage).toBe('Failed to load accounts');
  });

  it('should navigate to account detail when viewAccount is called', () => {
    component.viewAccount('0000000001');
    expect(router.navigate).toHaveBeenCalledWith(['/accounts', '0000000001']);
  });
});
