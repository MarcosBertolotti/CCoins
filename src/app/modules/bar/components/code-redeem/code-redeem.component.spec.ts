import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeRedeemComponent } from './code-redeem.component';

describe('CodeRedeemComponent', () => {
  let component: CodeRedeemComponent;
  let fixture: ComponentFixture<CodeRedeemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeRedeemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeRedeemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
