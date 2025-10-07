import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountAdd } from './account-add';

describe('AccountAdd', () => {
  let component: AccountAdd;
  let fixture: ComponentFixture<AccountAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
