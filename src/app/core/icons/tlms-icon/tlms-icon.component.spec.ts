import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TlmsIconComponent} from './tlms-icon.component';

describe('IconTlmsComponent', () => {
  let component: TlmsIconComponent;
  let fixture: ComponentFixture<TlmsIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TlmsIconComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TlmsIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
