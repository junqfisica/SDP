import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FdsnCreateComponent } from './fdsn-create.component';

describe('FdsnCreateComponent', () => {
  let component: FdsnCreateComponent;
  let fixture: ComponentFixture<FdsnCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FdsnCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FdsnCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
