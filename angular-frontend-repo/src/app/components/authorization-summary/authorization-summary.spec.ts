import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizationSummary } from './authorization-summary';

describe('AuthorizationSummary', () => {
  let component: AuthorizationSummary;
  let fixture: ComponentFixture<AuthorizationSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorizationSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizationSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
