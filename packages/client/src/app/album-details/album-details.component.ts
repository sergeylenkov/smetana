import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { AlbumsService } from '../albums.service';
import { Album } from '../dto/album';

@Component({
  selector: 'app-album-details',
  templateUrl: './album-details.component.html',
  styleUrls: ['./album-details.component.scss']
})
export class AlbumDetailsComponent implements OnInit {
  public album?: Album;

  constructor(private service: AlbumsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.getTracks(id);
  }

  async getTracks(id: number) {
    this.album = await this.service.getTracks(id);
  }

  playTrack(id: number) {
    const track = this.album?.tracks.find((item) => {
      return item.id === id;
    })

    if (track) {
      const myAudio = document.createElement('audio');

      if (myAudio.canPlayType('audio/mpeg')) {
        myAudio.setAttribute('src', track.url);
      }

      myAudio.play();
    }
  }
}
