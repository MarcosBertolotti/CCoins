import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarPrizesComponent } from './bar-prizes.component';

describe('BarPrizesComponent', () => {
  let component: BarPrizesComponent;
  let fixture: ComponentFixture<BarPrizesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarPrizesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarPrizesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
