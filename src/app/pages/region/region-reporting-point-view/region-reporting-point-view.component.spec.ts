import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RegionReportingPointViewComponent} from './region-reporting-point-view.component';

describe('RegionReportingPointViewComponent', () => {
  let component: RegionReportingPointViewComponent;
  let fixture: ComponentFixture<RegionReportingPointViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegionReportingPointViewComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegionReportingPointViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
