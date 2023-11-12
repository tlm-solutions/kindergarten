import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TrackEditComponent} from './track-edit.component';

describe('TrackEditComponent', () => {
  let component: TrackEditComponent;
  let fixture: ComponentFixture<TrackEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackEditComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TrackEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
