import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditStudentComponent } from './admin-edit-student.component';

describe('AdminEditStudentComponent', () => {
  let component: AdminEditStudentComponent;
  let fixture: ComponentFixture<AdminEditStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminEditStudentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
