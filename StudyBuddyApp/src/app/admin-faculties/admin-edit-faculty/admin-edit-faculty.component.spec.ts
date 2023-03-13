import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditFacultyComponent } from './admin-edit-faculty.component';

describe('AdminEditFacultyComponent', () => {
  let component: AdminEditFacultyComponent;
  let fixture: ComponentFixture<AdminEditFacultyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminEditFacultyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditFacultyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
