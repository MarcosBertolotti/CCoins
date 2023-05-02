import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandTableComponent } from './demand-table.component';

describe('DemandTableComponent', () => {
  let component: DemandTableComponent;
  let fixture: ComponentFixture<DemandTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
