import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDeleteDepartmentComponent } from './admin-delete-department.component';

describe('AdminDeleteDepartmentComponent', () => {
  let component: AdminDeleteDepartmentComponent;
  let fixture: ComponentFixture<AdminDeleteDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDeleteDepartmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDeleteDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
