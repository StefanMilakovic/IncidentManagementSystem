import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentStatusHistoryComponent } from './incident-status-history-component';

describe('IncidentStatusHistoryComponent', () => {
  let component: IncidentStatusHistoryComponent;
  let fixture: ComponentFixture<IncidentStatusHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentStatusHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentStatusHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
