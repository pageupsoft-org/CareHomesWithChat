import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionsMatrixComponent } from './permissions-matrix.component';

describe('PermissionsMatrixComponent', () => {
  let component: PermissionsMatrixComponent;
  let fixture: ComponentFixture<PermissionsMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionsMatrixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionsMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
