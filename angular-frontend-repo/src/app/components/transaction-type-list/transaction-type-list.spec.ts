import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTypeList } from './transaction-type-list';

describe('TransactionTypeList', () => {
  let component: TransactionTypeList;
  let fixture: ComponentFixture<TransactionTypeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionTypeList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionTypeList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
