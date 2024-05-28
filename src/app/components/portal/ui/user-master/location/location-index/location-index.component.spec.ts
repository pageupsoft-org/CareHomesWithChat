import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationIndexComponent } from './location-index.component';

describe('LocationIndexComponent', () => {
  let component: LocationIndexComponent;
  let fixture: ComponentFixture<LocationIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
