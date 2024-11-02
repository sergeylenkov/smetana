import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { PlayerState } from '../../models/player';
import { Track } from '../../dto/track';
import { Subscription } from 'rxjs';
import { RadioService } from '../../services/radio.service';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  providers: [RadioService],
})
export class RadioComponent implements OnInit {
  private _tracks: Track[] = [];
  private _onStart?: Subscription;
  private _onStop?: Subscription;
  public stateType = PlayerState;
  public tracksCount = 0;
  public totalDuration = 0;

  constructor(private service: RadioService, private playerService: PlayerService) {}

  ngOnInit(): void {
    this._onStart = this.playerService.onStart.subscribe((track: Track) => {
      this.loadAlbumForTrack(track);
    });

    this._onStop = this.playerService.onStop.subscribe(() => {
      //
    });

    this.getTracks();
  }

  ngOnDestroy(): void {
    this._onStart && this._onStart.unsubscribe();
    this._onStop && this._onStop.unsubscribe();
  }

  private async loadAlbumForTrack(track: Track) {
    const albums = await this.service.getTrackAlbums(track.id);
    this.playerService.album = albums[0];
  }

  public async getTracks() {
    this._tracks = await this.service.getTracks();

    this._tracks.sort((a, b) => {
      return Math.random() - 0.5;
    });

    this.playerService.tracks = this._tracks;
    this.tracksCount = this._tracks.length;
    this.totalDuration = this._tracks.reduce((value, track) => {
      return value + track.duration;
    }, 0);
  }

  public getState(): PlayerState {
    return this.playerService.state;
  }

  public onPlay() {
    this.playerService.playTrack(this._tracks[0]);
  }

  public onPause() {
    this.playerService.pause();
  }

  public onResume() {
    this.playerService.resume();
  }

  public getDuration() {
    const totalMinutes = Math.round(this.totalDuration / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const minutes = totalMinutes - totalHours * 60;
    const hours = totalHours - totalDays * 24;

    return `${totalDays} days ${hours} hours ${minutes} minutes`
  }
}
