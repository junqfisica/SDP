import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingListComponent } from './setting-list.component';

describe('SettingListComponent', () => {
  let component: SettingListComponent;
  let fixture: ComponentFixture<SettingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
