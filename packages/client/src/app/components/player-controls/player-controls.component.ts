import { Component, OnInit } from '@angular/core';
import { PlayerState } from 'src/app/models/player';
import { Track } from '../../dto/track';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-player-controls',
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.scss'],
})
export class PlayerControlsComponent implements OnInit {
  public track?: Track;
  public PlayerState = PlayerState;
  public progress = 100;

  constructor(private playerService: PlayerService) {
    this.playerService.onStart.subscribe((track: Track) => {
      this.track = track;
      this.progress = 100;
    });

    this.playerService.onProgress.subscribe((progress: number) => {
      this.progress = progress;
    })
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

  public get volume(): number {
    return this.playerService.volume;
  }

  public onPlayClick() {
    if (this.playerService.state == PlayerState.Stopped) {
      this.track && this.playerService.playTrack(this.track);
    }

    if (this.playerService.state == PlayerState.Paused) {
      this.playerService.resume();
    }

    if (this.playerService.state == PlayerState.Playing) {
      this.playerService.pause();
    }
  }

  public onNextTrack() {
    this.playerService.nextTrack();
  }

  public onPreviousTrack() {
    this.playerService.previousTrack();
  }

  public onVolumeChange(volume: number) {
    this.playerService.volume = volume;
  }
}
