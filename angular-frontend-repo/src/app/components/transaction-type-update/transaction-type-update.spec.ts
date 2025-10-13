import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTypeUpdate } from './transaction-type-update';

describe('TransactionTypeUpdate', () => {
  let component: TransactionTypeUpdate;
  let fixture: ComponentFixture<TransactionTypeUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionTypeUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionTypeUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
