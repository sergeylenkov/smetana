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

  constructor(private playerService: PlayerService) {
    playerService.onStart.subscribe((track: Track) => {
      this.track = playerService.track;
      this.album = playerService.album;
    });
  }

  ngOnInit(): void {
  }
}
