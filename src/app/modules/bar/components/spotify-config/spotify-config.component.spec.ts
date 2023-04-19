import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotifyConfigComponent } from './spotify-config.component';

describe('SpotifyConfigComponent', () => {
  let component: SpotifyConfigComponent;
  let fixture: ComponentFixture<SpotifyConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpotifyConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotifyConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
