import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditCourseComponent } from './admin-edit-course.component';

describe('AdminEditCourseComponent', () => {
  let component: AdminEditCourseComponent;
  let fixture: ComponentFixture<AdminEditCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminEditCourseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
