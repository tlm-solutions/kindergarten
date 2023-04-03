import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TrackIconComponent} from './track-icon.component';

describe('TrackIconComponent', () => {
  let component: TrackIconComponent;
  let fixture: ComponentFixture<TrackIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackIconComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TrackIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
