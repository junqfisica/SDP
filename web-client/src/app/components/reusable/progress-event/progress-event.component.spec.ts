import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressEventComponent } from './progress-event.component';

describe('ProgressEventComponent', () => {
  let component: ProgressEventComponent;
  let fixture: ComponentFixture<ProgressEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
