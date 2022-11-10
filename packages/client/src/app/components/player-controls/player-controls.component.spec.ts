import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerControlsComponent } from './player-controls.component';

describe('PlayerComponent', () => {
  let component: PlayerControlsComponent;
  let fixture: ComponentFixture<PlayerControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerControlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
