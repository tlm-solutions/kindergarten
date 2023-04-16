import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MapWindshieldComponent} from './map-windshield.component';

describe('MapWindshieldComponent', () => {
  let component: MapWindshieldComponent;
  let fixture: ComponentFixture<MapWindshieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapWindshieldComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MapWindshieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
