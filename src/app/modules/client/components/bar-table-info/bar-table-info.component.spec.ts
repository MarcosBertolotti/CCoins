import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarTableInfoComponent } from './bar-table-info.component';

describe('BarTableInfoComponent', () => {
  let component: BarTableInfoComponent;
  let fixture: ComponentFixture<BarTableInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarTableInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarTableInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
