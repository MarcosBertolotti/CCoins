import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarUpdateComponent } from './bar-update.component';

describe('BarUpdateComponent', () => {
  let component: BarUpdateComponent;
  let fixture: ComponentFixture<BarUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
