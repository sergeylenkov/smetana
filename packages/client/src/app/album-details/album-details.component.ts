import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlbumsService } from '../albums.service';
import { Album } from '../dto/album';
import { Track } from '../dto/track';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-album-details',
  templateUrl: './album-details.component.html',
  styleUrls: ['./album-details.component.scss']
})
export class AlbumDetailsComponent implements OnInit {
  public album?: Album;
  public currentTrack?: Track;

  constructor(private service: AlbumsService, private route: ActivatedRoute, private player: PlayerService) {
    player.onTrackEnded.subscribe(() => {
      this.playNext();
    })
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.getTracks(id);
  }

  private async getTracks(id: number) {
    this.album = await this.service.getTracks(id);
  }

  public playTrack(id: number) {
    const track = this.album?.tracks.find((item) => {
      return item.id === id;
    })

    if (track) {
      this.currentTrack = track;

      this.player.setVolume(0.2);
      this.player.playTrack(track);
    }
  }

  public stopTrack() {
    this.currentTrack = undefined;
    this.player.stop();
  }

  private playNext() {
    if (this.album && this.album.tracks && this.currentTrack) {
      let index = this.album?.tracks.indexOf(this.currentTrack);

      if (index !== -1 && index < this.album.tracks.length - 1) {
        index = index + 1;
        const nextTrack = this.album.tracks[index];

        this.playTrack(nextTrack.id);
      }
    }
  }
}
