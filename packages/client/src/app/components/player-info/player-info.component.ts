import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Album } from '../../dto/album';
import { Track } from '../../dto/track';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-player-info',
  templateUrl: './player-info.component.html',
  styleUrls: ['./player-info.component.scss']
})
export class PlayerInfoComponent implements OnInit, OnDestroy {
  public track?: Track;
  public album?: Album;
  public artists: string = '';
  private _subscription?: Subscription;

  constructor(private playerService: PlayerService) {}

  ngOnInit(): void {
    this._subscription = this.playerService.onStart.subscribe((track: Track) => {
      this.track = this.playerService.track;
      this.album = this.playerService.album;
      this.artists = this.album?.artists.map(artist => artist.name).join(', ') || '';
    });
  }

  ngOnDestroy(): void {
    this._subscription && this._subscription.unsubscribe();
  }
}
