import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditDepartmentComponent } from './admin-edit-department.component';

describe('AdminEditDepartmentComponent', () => {
  let component: AdminEditDepartmentComponent;
  let fixture: ComponentFixture<AdminEditDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminEditDepartmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
