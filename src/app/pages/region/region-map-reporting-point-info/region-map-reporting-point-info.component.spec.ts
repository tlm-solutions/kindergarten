import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RegionMapReportingPointInfoComponent} from './region-map-reporting-point-info.component';

describe('RegionMapReportingPointInfoComponent', () => {
  let component: RegionMapReportingPointInfoComponent;
  let fixture: ComponentFixture<RegionMapReportingPointInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegionMapReportingPointInfoComponent]
    });
    fixture = TestBed.createComponent(RegionMapReportingPointInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
