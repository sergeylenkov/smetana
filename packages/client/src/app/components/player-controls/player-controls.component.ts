import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PlayerState } from 'src/app/models/player';
import { Track } from '../../dto/track';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-player-controls',
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerControlsComponent implements OnInit {
  public track?: Track;
  public stateType = PlayerState;

  constructor(private playerService: PlayerService, private ref: ChangeDetectorRef) {
    this.playerService.onStart.subscribe((track: Track) => {
      this.track = track;
      this.ref.detectChanges();
    });

    this.playerService.onStop.subscribe(() => {
      this.ref.detectChanges();
    });

    this.playerService.onPause.subscribe(() => {
      this.ref.detectChanges();
    });

    this.playerService.onResume.subscribe(() => {
      this.ref.detectChanges();
    });
  }

  ngOnInit(): void {
  }

  public get state(): PlayerState {
    return this.playerService.state;
  }

  public get isFirstTrack(): boolean {
    return this.playerService.isFirstTrack;
  }

  public get isLastTrack(): boolean {
    return this.playerService.isLastTrack;
  }

  public onPauseTrack() {
    this.playerService.pause();
  }

  public onResumeTrack() {
    this.playerService.resume();
  }
  public onNextTrack() {
    this.playerService.nextTrack();
  }

  public onPreviousTrack() {
    this.playerService.previousTrack();
  }
}
