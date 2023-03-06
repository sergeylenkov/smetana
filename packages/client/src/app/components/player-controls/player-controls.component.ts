import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { PlayerState } from '../../models/player';
import { Track } from '../../dto/track';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-player-controls',
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.scss'],
})
export class PlayerControlsComponent implements OnInit, OnDestroy {
  public track?: Track;
  public PlayerState = PlayerState;
  public progress = 100;
  private _onStart?: Subscription;
  private _onProgress?: Subscription;

  constructor(private playerService: PlayerService) {
  }

  ngOnInit(): void {
    this._onStart = this.playerService.onStart.subscribe((track: Track) => {
      this.track = track;
      this.progress = 100;
    });

    this._onProgress = this.playerService.onProgress.subscribe((progress: number) => {
      this.progress = progress;
    })
  }

  ngOnDestroy(): void {
    this._onStart && this._onStart.unsubscribe();
    this._onProgress && this._onProgress.unsubscribe();
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
