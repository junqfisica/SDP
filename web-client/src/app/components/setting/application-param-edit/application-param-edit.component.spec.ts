import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationParamEditComponent } from './application-param-edit.component';

describe('ApplicationParamEditComponent', () => {
  let component: ApplicationParamEditComponent;
  let fixture: ComponentFixture<ApplicationParamEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationParamEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationParamEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
