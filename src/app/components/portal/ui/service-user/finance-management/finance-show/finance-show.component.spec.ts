import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceShowComponent } from './finance-show.component';

describe('FinanceShowComponent', () => {
  let component: FinanceShowComponent;
  let fixture: ComponentFixture<FinanceShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
