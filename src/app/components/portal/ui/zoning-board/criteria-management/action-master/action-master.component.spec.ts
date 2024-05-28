import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionMasterComponent } from './action-master.component';

describe('ActionMasterComponent', () => {
  let component: ActionMasterComponent;
  let fixture: ComponentFixture<ActionMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
