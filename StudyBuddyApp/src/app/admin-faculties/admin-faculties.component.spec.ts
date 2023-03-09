import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFacultiesComponent } from './admin-faculties.component';

describe('AdminFacultiesComponent', () => {
  let component: AdminFacultiesComponent;
  let fixture: ComponentFixture<AdminFacultiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminFacultiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminFacultiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
