import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RegionListComponent} from './region-list.component';

describe('RegionListComponent', () => {
  let component: RegionListComponent;
  let fixture: ComponentFixture<RegionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegionListComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
