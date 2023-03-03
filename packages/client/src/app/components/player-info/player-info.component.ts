import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { t } from '../../locales';
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
  private _onStart?: Subscription;
  private _onStop?: Subscription;

  constructor(private playerService: PlayerService, private titleService: Title) {}

  ngOnInit(): void {
    this._onStart = this.playerService.onStart.subscribe((track: Track) => {
      this.track = this.playerService.track;
      this.album = this.playerService.album;
      this.artists = this.album?.artists.map(artist => artist.name).join(', ') || '';

      this.titleService.setTitle(`${this.track?.title} - ${this.artists}`);
    });

    this._onStop = this.playerService.onEnd.subscribe(() => {
      this.titleService.setTitle(t('Smetana'));
    })
  }

  ngOnDestroy(): void {
    this._onStart && this._onStart.unsubscribe();
    this._onStop && this._onStop.unsubscribe();
  }
}
