import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyCoinsComponent } from './party-coins.component';

describe('PartyCoinsComponent', () => {
  let component: PartyCoinsComponent;
  let fixture: ComponentFixture<PartyCoinsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyCoinsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyCoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
