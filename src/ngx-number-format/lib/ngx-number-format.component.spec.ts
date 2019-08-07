import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxNumberFormatComponent } from './ngx-number-format.component';

describe('NgxNumberFormatComponent', () => {
  let component: NgxNumberFormatComponent;
  let fixture: ComponentFixture<NgxNumberFormatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxNumberFormatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxNumberFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
