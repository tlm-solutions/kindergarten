import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RegionIconComponent} from './region-icon.component';

describe('RegionIconComponent', () => {
  let component: RegionIconComponent;
  let fixture: ComponentFixture<RegionIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegionIconComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegionIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
