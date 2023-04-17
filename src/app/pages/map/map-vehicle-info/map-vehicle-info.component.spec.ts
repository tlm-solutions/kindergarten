import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MapVehicleInfoComponent} from './map-vehicle-info.component';

describe('MapVehicleInfComponent', () => {
  let component: MapVehicleInfoComponent;
  let fixture: ComponentFixture<MapVehicleInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapVehicleInfoComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MapVehicleInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
