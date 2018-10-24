import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepcmtComponent } from './repcmt.component';

describe('RepcmtComponent', () => {
  let component: RepcmtComponent;
  let fixture: ComponentFixture<RepcmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepcmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepcmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
