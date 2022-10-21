import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlbumsService } from '../../services/albums.service';
import { Album } from '../../dto/album';
import { Track } from '../../dto/track';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-album-details',
  templateUrl: './album-details.component.html',
  styleUrls: ['./album-details.component.scss']
})
export class AlbumDetailsComponent implements OnInit {
  public album?: Album;
  public currentTrack?: Track;

  constructor(private service: AlbumsService, private route: ActivatedRoute, private player: PlayerService) {
    player.onTrackStart.subscribe((track: Track) => {
      this.currentTrack = player.track;
      this.album = player.album;
    });

    player.onStop.subscribe(() => {
      this.currentTrack = player.track;
      this.album = player.album;
    });
  }

  ngOnInit(): void {
    this.currentTrack = this.player.track;
    this.album = this.player.album;

    const id = this.route.snapshot.params['id'];
    this.getTracks(id);
  }

  private async getTracks(id: number) {
    const album = await this.service.getTracks(id);

    if (album) {
      album.tracks.sort((a, b) => {
        return a.track - b.track;
      })

      this.album = album;
      this.player.album = this.album;
    }
  }

  public playTrack(id: number) {
    const track = this.album?.tracks.find((item) => {
      return item.id === id;
    })

    if (track) {
      this.player.playTrack(track);
    }
  }

  public pauseTrack() {
    this.player.pause();
  }
}
