import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDeleteCourseComponent } from './admin-delete-course.component';

describe('AdminDeleteCourseComponent', () => {
  let component: AdminDeleteCourseComponent;
  let fixture: ComponentFixture<AdminDeleteCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDeleteCourseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDeleteCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
