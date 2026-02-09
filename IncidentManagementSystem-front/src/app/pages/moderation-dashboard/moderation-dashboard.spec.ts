import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModerationDashboard } from './moderation-dashboard';

describe('ModerationDashboard', () => {
  let component: ModerationDashboard;
  let fixture: ComponentFixture<ModerationDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModerationDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModerationDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
