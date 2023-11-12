import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MapRegionSelectorComponent} from './map-region-selector.component';

describe('MapRegionSelectorComponent', () => {
  let component: MapRegionSelectorComponent;
  let fixture: ComponentFixture<MapRegionSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MapRegionSelectorComponent]
    });
    fixture = TestBed.createComponent(MapRegionSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
