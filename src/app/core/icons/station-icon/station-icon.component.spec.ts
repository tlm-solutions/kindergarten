import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StationIconComponent} from './station-icon.component';

describe('StationIconComponent', () => {
  let component: StationIconComponent;
  let fixture: ComponentFixture<StationIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StationIconComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StationIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
