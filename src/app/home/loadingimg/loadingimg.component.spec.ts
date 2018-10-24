import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingimgComponent } from './loadingimg.component';

describe('LoadingimgComponent', () => {
  let component: LoadingimgComponent;
  let fixture: ComponentFixture<LoadingimgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingimgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingimgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
