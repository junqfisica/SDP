import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationAttachedComponent } from './station-attached.component';

describe('StationAttachedComponent', () => {
  let component: StationAttachedComponent;
  let fixture: ComponentFixture<StationAttachedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationAttachedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationAttachedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
