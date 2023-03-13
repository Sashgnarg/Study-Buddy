import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDeleteFacultyComponent } from './admin-delete-faculty.component';

describe('AdminDeleteFacultyComponent', () => {
  let component: AdminDeleteFacultyComponent;
  let fixture: ComponentFixture<AdminDeleteFacultyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDeleteFacultyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDeleteFacultyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
