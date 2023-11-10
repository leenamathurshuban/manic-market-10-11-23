import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilechatComponent } from './mobilechat.component';

describe('MobilechatComponent', () => {
  let component: MobilechatComponent;
  let fixture: ComponentFixture<MobilechatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobilechatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobilechatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
