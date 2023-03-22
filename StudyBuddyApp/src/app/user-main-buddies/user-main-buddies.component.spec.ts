import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMainBuddiesComponent } from './user-main-buddies.component';

describe('UserMainBuddiesComponent', () => {
  let component: UserMainBuddiesComponent;
  let fixture: ComponentFixture<UserMainBuddiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserMainBuddiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserMainBuddiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
