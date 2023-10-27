import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionReportingPointViewMapComponent } from './region-reporting-point-view-map.component';

describe('RegionReportingPointViewMapComponent', () => {
  let component: RegionReportingPointViewMapComponent;
  let fixture: ComponentFixture<RegionReportingPointViewMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegionReportingPointViewMapComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegionReportingPointViewMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
