import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapViewWrapperComponent } from './map-view-wrapper-component';

describe('MapViewWrapperComponent', () => {
  let component: MapViewWrapperComponent;
  let fixture: ComponentFixture<MapViewWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapViewWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapViewWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
