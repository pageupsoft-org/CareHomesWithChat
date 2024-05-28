import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFifteenShowComponent } from './form-fifteen-show.component';

describe('FormFifteenShowComponent', () => {
  let component: FormFifteenShowComponent;
  let fixture: ComponentFixture<FormFifteenShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormFifteenShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFifteenShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
