import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcmtComponent } from './subcmt.component';

describe('SubcmtComponent', () => {
  let component: SubcmtComponent;
  let fixture: ComponentFixture<SubcmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubcmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
