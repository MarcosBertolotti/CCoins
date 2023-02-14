import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarGamesComponent } from './bar-games.component';

describe('BarGamesComponent', () => {
  let component: BarGamesComponent;
  let fixture: ComponentFixture<BarGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarGamesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
