import { Component, OnInit } from '@angular/core';
import { Album } from '../../dto/album';
import { Track } from '../../dto/track';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  public track?: Track;
  public album?: Album;
  public artists: string = '';

  constructor(private playerService: PlayerService) {
    this.playerService.onStart.subscribe((track: Track) => {
      this.track = this.playerService.track;
      this.album = this.playerService.album;
      this.artists = this.album?.artists.map(artist => artist.name).join(', ') || '';
    });
  }

  ngOnInit(): void {
  }
}
