import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionReportingPointInfoComponent } from './region-reporting-point-info.component';

describe('RegionReportingPointInfoComponent', () => {
  let component: RegionReportingPointInfoComponent;
  let fixture: ComponentFixture<RegionReportingPointInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegionReportingPointInfoComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegionReportingPointInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
