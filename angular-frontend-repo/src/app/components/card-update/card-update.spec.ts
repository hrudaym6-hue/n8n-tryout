import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardUpdate } from './card-update';

describe('CardUpdate', () => {
  let component: CardUpdate;
  let fixture: ComponentFixture<CardUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
