import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillPayment } from './bill-payment';

describe('BillPayment', () => {
  let component: BillPayment;
  let fixture: ComponentFixture<BillPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillPayment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillPayment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
