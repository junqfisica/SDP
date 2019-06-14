import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapTlGoogleChartComponent } from './wrap-tl-google-chart.component';

describe('WrapTlGoogleChartComponent', () => {
  let component: WrapTlGoogleChartComponent;
  let fixture: ComponentFixture<WrapTlGoogleChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WrapTlGoogleChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapTlGoogleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
