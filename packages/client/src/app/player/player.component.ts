import { Component, OnInit } from '@angular/core';
import { Album } from '../dto/album';
import { Track } from '../dto/track';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  public track?: Track;
  public album?: Album;

  constructor(private player: PlayerService) {
    player.onTrackStart.subscribe((track: Track) => {
      this.track = player.track;
      this.album = player.album;
    });
  }

  ngOnInit(): void {
  }
}
