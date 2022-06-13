import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarCreateComponent } from './bar-create.component';

describe('BarComponent', () => {
  let component: BarCreateComponent;
  let fixture: ComponentFixture<BarCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
